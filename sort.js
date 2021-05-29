// GLOBALS
const TOTAL = 6
const MIN = 1
const MAX = 20
const NUMSTART = [['position', 'value', {role: 'style'}]]
const MAXSPEED = 2000   // slowest speed in ms
var nums = []           // list of lists of ints [0,5,'green'],[1,17,'green'],[2,18,'green'],[3,12,'green'],[4, 9,'green']
var SPEED

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

document.addEventListener('DOMContentLoaded', () => {
    randNums();

//    with (document.getElementById('speed')) {
//        this.max = MAXSPEED
//        this.value = MAXSPEED * 0.8
//        SPEED = MAXSPEED - this.value
//        console.log(this.max)
//        console.log(this.value)
//    };
    document.getElementById('speed').max = MAXSPEED;
    document.getElementById('speed').value = MAXSPEED*0.8;
    SPEED = MAXSPEED - (MAXSPEED*0.8);



    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    document.querySelector('#randomize').onclick = () => {
        randNums();
        drawChart();
    };

    document.querySelector('#sort').onclick = numSort;

    document.querySelector('#selection').onclick = selectionSort;

    document.querySelector('#bubble').onclick = bubbleSort;

    document.querySelector('#insertion').onclick = insertionSort;

    document.querySelector('#random').onclick = randomSort;

    document.querySelector('#quick').onclick = () => {
        quickSort(0, TOTAL - 1)
    };

    document.querySelector('#speed').onchange = function () {
        SPEED = MAXSPEED - this.value
    };
});

function drawChart() {

    // Create the data table.
    var data = new google.visualization.arrayToDataTable(NUMSTART.concat(nums), false);

    // Set chart options
    var options = {'title':'Numbers',
//                   'width':800,
//                   'height':400,
                   'bars' : 'vertical',
                   'is3D' : 'true',
                   'legend' : 'none',
                   backgroundColor : 'none',
                   vaxis : {textPosition: 'none' },
                   };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};

function randInt() {
    if (arguments.length == 0){
        return Math.floor(Math.random() * (MAX - MIN)) + MIN
    } else if (arguments.length == 2) {
        return Math.floor(Math.random() * (arguments[1] - arguments[0])) + arguments[0]
    };
};

//function randInt(min, max) {
//    return Math.floor(Math.random() * (max - min)) + min
//};

function randNums() {
    // reset nums with random values
    nums = []
    for (i=0; i < TOTAL; i++) {
        nums.push([i, randInt(), '#069420']);
        //'#bababa' grey
        //'#069420' green
    };
};

function numSort() {
    nums.sort(function (a, b) {
        return a[1] - b[1]
    });

    for (i=0; i < TOTAL; i++) {
        nums[i][0] = i
    };
    console.log(nums)
    drawChart();
};

async function selectionSort() {
    var smallVal
    var prevIdx
    var tmp

    // For each i, check the rest of the list for the smallest value.
    // Then swap i with the smallest value
    for (i=0; i < TOTAL; i++) {
        smallVal = nums[i][1]
        prevIdx = i
        nums[i][2] = 'red'
        drawChart();
        await sleep(SPEED)
        for (j=i+1; j < TOTAL; j++) {
            if (nums[j][1] < smallVal) {
                smallVal = nums[j][1]
                nums[j][2] = 'yellow'
                if (prevIdx != i) {
                    nums[prevIdx][2] = '#069420'
                };
                prevIdx = j
                drawChart();
                await sleep(SPEED);
            };
        };
        tmp = nums[i][1]
        nums[i][1] = nums[prevIdx][1]
        nums[prevIdx][1] = tmp
        nums[i][2] = 'purple'
        nums[prevIdx][2] = 'purple'
        drawChart();
        await sleep(SPEED);
        nums[i][2] = '#069420'
        nums[prevIdx][2] = '#069420'
    };
};

async function bubbleSort() {
    var smallVal
    var prevIdx
    var tmp
    var swap = true

    // Go through entire list, swapping when val(i) < val(i+1).
    // Stop when you go through list with no swaps
    while (swap == true) {
        swap = false
        for (i=0; i < TOTAL - 1; i++) {
            nums[i][2] = 'red'
            nums[i+1][2] = 'yellow'
            drawChart();
            await sleep(SPEED)
            if (nums[i][1] > nums[i+1][1]) {
                swap = true
                tmp = nums[i][1]
                nums[i][1] = nums[i+1][1]
                nums[i+1][1] = tmp
                nums[i][2] = 'purple'
                nums[i+1][2] = 'purple'
                drawChart();
                await sleep(SPEED)
            };
            nums[i][2] = '#069420'
            if (i == TOTAL - 2) {
                nums[i+1][2] = '#069420'
            };
        };
    };
};

async function insertionSort() {
    var tmp

    for (i=1; i < TOTAL; i++) {
        var j = i
        nums[j][2] = 'red'
        nums[j-1][2] = 'yellow'
        drawChart();
        await sleep(SPEED)
        while (j > 0 && nums[j-1][1] > nums[j][1]) {

            nums[j][2] = 'purple'
            nums[j-1][2] = 'purple'
            tmp = nums[j][1]
            nums[j][1] = nums[j-1][1]
            nums[j-1][1] = tmp
            j--
            drawChart();
            await sleep(SPEED)
            nums[j+1][2] = '#069420'
            nums[j][2] = 'red'
            if (j !== 0) {
                nums[j-1][2] = 'yellow'
                drawChart();
                await sleep(SPEED)
            };
        };
        if (j > 0) {
            nums[j-1][2] = '#069420'
        };
        nums[j][2] = '#069420'
    };
};

async function quickSort(left, right) {
    var l = left;
    var r = right;
    var tmp;
    var color = '#'+ Math.floor(Math.random()*16777215).toString(16)
    // Set pivot index as middle of array (arbitrary)
    // Store pivot value
    var pivot = Math.floor((l + r) / 2);
    var pivotVal = nums[pivot][1];

    // Base case: no modifications if there is only one value in array
    if (l >= r) {
        return 0;
    };

    for (i=left; i<=right; i++) {
        nums[i][2] = color;
    };

    nums[pivot][2] = 'red';
    drawChart();
    await sleep(SPEED);

    // Go until l and r pointers meet
    while (l <= r) {
        // Swap l if val(l) > pivotVal, keep going if not
        while (l < right && nums[l][1] < pivotVal) {
            l++;
        };
        // Swap r if val(r) <>> pivotVal, keep going if not
        while (r > left && nums[r][1] > pivotVal) {
            r--;
        };
        // Perform swap, checking if pointers are still valid
        if (l <= r) {

            if (l == pivot) {
                nums[pivot][2] = color
                pivot = r;
                nums[pivot][2] = 'red'
            } else if (r == pivot) {
                nums[pivot][2] = color
                pivot = l
                nums[pivot][2] = 'red'
            };

            tmp = nums[l][1];
            nums[l][1] = nums[r][1];
            nums[r][1] = tmp;
            drawChart();
            await sleep(SPEED);
            l++;
            r--;
        };
    };
    nums[pivot][2] = color
    nums[l][2] = 'red'
    quickSort(left, l-1);
    quickSort(l, right);
};

async function randomSort() {
    var sorted = false
    var ans = []


    while (!sorted) {
        // Make array to fill with randomly selected nums
        ans = []
        for (i=0; i<TOTAL; i++) {
            ans.push(-1)
        };

        // Fill array with random values from nums
        for (i=0; i<TOTAL; i++) {
            j = randInt(0, TOTAL-1)
            while (ans[j] != -1 ) {
                j++
                j %= TOTAL
            };
            ans[j] = nums[i]
            ans[j][0] = j
        };
        nums = ans
        drawChart();
        await sleep(SPEED);
        sorted = true
        ans.sort(function (a, b) {
            return a[0] - b[0]
        });
        for (i=0; i<TOTAL-1; i++) {
            if (ans[i][1] > ans[i+1][1]) {
                sorted = false
                break
            };
        };
    };
};

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
};
