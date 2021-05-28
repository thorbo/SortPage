// GLOBALS
const TOTAL = 10
const MIN = 1
const MAX = 20
const NUMSTART = [['position', 'value', {role: 'style'}]]
const MAXSPEED = 2000   // slowest speed in ms
var nums = []           // list of lists of ints
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

    document.querySelector('#random').onclick = () => {
        randNums();
        drawChart();
    };

    document.querySelector('#sort').onclick = () => {
        numSort();
    };

    document.querySelector('#selection').onclick = () => {
        selectionSort();
    };

    document.querySelector('#bubble').onclick = () => {
            bubbleSort();
    };

    document.querySelector('#insertion').onclick = () => {
            insertionSort();
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
    return Math.floor(Math.random() * (MAX - MIN)) + MIN
};

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

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
};
