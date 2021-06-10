// GLOBALS
var TOTAL          // number of elements to sort
const MIN = 1           // min number value
const MAX = 50          // max number value
const NUMSTART = [['position', 'value', {role: 'style'}]]       // header row for data in google charts
const MAXSPEED = 1500   // slowest speed in ms
var nums = []           // list of lists of ints [0,5,'green'],[1,17,'green'],[2,18,'green'],[3,12,'green'],[4, 9,'green']
var SPEED
var searchnum

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']})

document.addEventListener('DOMContentLoaded', () => {
    // Set TOTAL elements
    document.getElementById('number').value = 10
    TOTAL = document.getElementById('number').value

    // Load nums
    randNums()

    // Set SPEED
    document.getElementById('speed').max = MAXSPEED;
    document.getElementById('speed').value = MAXSPEED * 0.8;
    SPEED = MAXSPEED - (MAXSPEED*0.8);

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Set onclick values for all buttons
    document.querySelector('#randomize').onclick = () => {
        randNums()
        drawChart()
    }
    document.querySelector('#sort').onclick = numSort
    document.querySelector('#selection').onclick = selectionSort
    document.querySelector('#bubble').onclick = bubbleSort
    document.querySelector('#insertion').onclick = insertionSort
    document.querySelector('#random').onclick = randomSort
    document.querySelector('#merge').onclick = () => {
        // Copy nums by value into dup_nums. Perform sort on dup_nums
        const dup_nums = [...nums]
        for (i=0; i<dup_nums.length; i++){
            dup_nums[i] = [...dup_nums[i]]
        }
        mergeSort(dup_nums)
    }
    document.querySelector('#shell').onclick = shellSort
    document.querySelector('#heap').onclick = heapSort
    document.querySelector('#quick').onclick = () => {quickSort(0, TOTAL - 1)}
    document.querySelector('#linear').onclick = () => {searchwrap(linear)}
    document.querySelector('#binary').onclick = () => {searchwrap(binary)}
    document.querySelector('#speed').onchange = function () {SPEED = MAXSPEED - this.value}
    document.querySelector('#number').onchange = function () {TOTAL = this.value}
})

function drawChart() {

    // Create the data table.
    var data = new google.visualization.arrayToDataTable(NUMSTART.concat(nums), false)

    // Set chart options
    var options = {'title':'Numbers',
//                   'width':800,
//                   'height':400,
                   'bars' : 'vertical',
                   'is3D' : 'true',
                   'legend' : 'none',
                   backgroundColor : 'none',
                   vaxis : {textPosition: 'none' },
                   }

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options)
}

function randInt() {
    if (arguments.length == 0){
        return Math.floor(Math.random() * (MAX - MIN)) + MIN
    } else if (arguments.length == 2) {
        return Math.floor(Math.random() * (arguments[1] - arguments[0])) + arguments[0]
    }
}

function randNums() {
    // reset nums with random values
    nums = []
    for (i=0; i < TOTAL; i++) {
        nums.push([i, randInt(), '#069420']);
    }
}

function numSort() {
    nums.sort(function (a, b) {
        return a[1] - b[1]
    })

    for (i=0; i < TOTAL; i++) {
        nums[i][0] = i
    }

    drawChart()
}

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
                }
                prevIdx = j
                drawChart();
                await sleep(SPEED);
            }
        }
        tmp = nums[i][1]
        nums[i][1] = nums[prevIdx][1]
        nums[prevIdx][1] = tmp
        nums[i][2] = 'purple'
        nums[prevIdx][2] = 'purple'
        drawChart();
        await sleep(SPEED);
        nums[i][2] = '#069420'
        nums[prevIdx][2] = '#069420'
    }
}

async function bubbleSort() {
    var tmp
    var swap = true
    var passes = 1

    // Go through entire list, swapping when val(i) > val(i+1).
    // Stop when you go through list with no swaps
    while (swap == true) {
        swap = false
        for (i=0; i < TOTAL - passes; i++) {
            nums[i][2] = 'red'
            nums[i+1][2] = 'yellow'
            drawChart()
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
            }
            nums[i][2] = '#069420'
//            if (i == TOTAL - 2) {
                nums[i+1][2] = '#069420'
//            }
        }
        passes++
    }
}

async function insertionSort() {
    var tmp

    for (i=1; i < TOTAL; i++) {
        var j = i
        nums[j][2] = 'red'
        nums[j-1][2] = 'yellow'
        drawChart()
        await sleep(SPEED)
        while (j > 0 && nums[j-1][1] > nums[j][1]) {
            tmp = nums[j][1]
            nums[j][1] = nums[j-1][1]
            nums[j-1][1] = tmp
            j--
            nums[j+1][2] = '#069420'
            nums[j][2] = 'red'
            if (j !== 0) {
                nums[j-1][2] = 'yellow'
            }
            nums[i][2] = 'purple'
            drawChart();
            await sleep(SPEED)
        }
        nums[i][2] = '#069420'
        if (j > 0) {
            nums[j-1][2] = '#069420'
        }
        nums[j][2] = '#069420'
    }
}

async function quickSort(left, right) {
    var l = left
    var r = right
    var tmp
    var color = '#'+ Math.floor(Math.random()*16777215).toString(16)    // random hex value
    // Set pivot index as middle of array (arbitrary)
    // Store pivot value
    var pivot = Math.floor((l + r) / 2)
    var pivotVal = nums[pivot][1]

    // Base case: no modifications if there is only one value in array
    if (l >= r) {
        return 0;
    }

    for (i=left; i<=right; i++) {
        nums[i][2] = color
    }

    nums[pivot][2] = 'red'
    drawChart()
    await sleep(SPEED)

    // Go until l and r pointers meet
    while (l <= r) {
        // Swap l if val(l) > pivotVal, keep going if not
        while (l < right && nums[l][1] < pivotVal) {
            l++
        }
        // Swap r if val(r) <>> pivotVal, keep going if not
        while (r > left && nums[r][1] > pivotVal) {
            r--
        }
        // Perform swap, checking if pointers are still valid
        if (l <= r) {

            if (l > pivot) {
                nums[pivot][2] = color
                pivot = l
                nums[pivot][2] = 'red'
            } else if (r < pivot) {
                nums[pivot][2] = color
                pivot = r
                nums[pivot][2] = 'red'
            }

            tmp = nums[l][1]
            nums[l][1] = nums[r][1]
            nums[r][1] = tmp
            drawChart()
            await sleep(SPEED)
            l++
            r--
        }
    }
    nums[pivot][2] = color
    quickSort(left, l-1)
    quickSort(l, right)
}

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

function mergeSort(arr0) {

    const middle = Math.floor((arr0.length)/2)

    if (arr0.length == 1){
        return arr0
    }

    // Splice half of the array to left, half to arr0. Middle not inclusive.
    const left = arr0.splice(0, middle)
    arr0 = merge(mergeSort(left), mergeSort(arr0))
    return arr0
}

function merge(arr1, arr2) {
    let arr3 = []
    let minIdx = Number.MAX_SAFE_INTEGER

    while (arr1.length && arr2.length){
        if (arr1[0][1] < arr2[0][1]) {
            let val = arr1.shift()
            if (val[0] < minIdx){
                minIdx = val[0]
            }
            arr3.push(val)
        } else {
            let val = arr2.shift()
            if (val[0] < minIdx){
                minIdx = val[0]
            }
            arr3.push(val)
        }
    }

    // Use spread operator to spread/flatten out each array and concatenate them
    arr1 = [...arr1, ...arr2]
    for (i=0; i < arr1.length; i++) {
        if (arr1[i][0] < minIdx) {
            minIdx = arr1[i][0]
        }
    }

    arr3 = [...arr3, ...arr1]
    let color = '#'+ Math.floor(Math.random()*16777215).toString(16)
    for (i=0; i < arr3.length; i++) {
        nums[minIdx][1] = arr3[i][1]
        nums[minIdx][2] = color    // random hex value
        minIdx++
    }

    drawChart()

    return arr3
}

async function shellSort() {
    let increment = Math.floor(nums.length / 2)

    while (increment > 0) {

        for (i=increment; i<nums.length; i++){
            let j = i
            let value = nums[i][1]

            nums[i][2] = 'red'
            nums[j-increment][2] = 'yellow'
            drawChart()
            await sleep(SPEED)

            while (j-increment >= 0 && nums[j-increment][1] > value) {
                nums[j][1] = nums[j-increment][1]

                nums[j][2] = 'purple'
                nums[j-increment][2] = 'purple'
                drawChart()
                await sleep(SPEED)
                nums[j][2] = '#069420'

                j -= increment

                if (j-increment >= 0){
                    nums[j-increment][2] = 'yellow'
                    drawChart()
                    await sleep(SPEED)
                }

            }
            nums[j][2] = '#069420'
            if (j-increment >= 0){
                nums[j-increment][2] = '#069420'
            }

            nums[j][1] = value
        }

        increment = Math.floor(increment/2)

    }
    drawChart()
}

function heapSort() {
    return 0
}

function searchwrap(func) {
    searchnum = Number(document.querySelector('#searchnum').value)
    if (searchnum) {
        func(searchnum)
    } else {
        alert("Enter Search Value")
    }
}

async function linear(searchnum) {
    for (i=0; i<nums.length; i++) {
        if (i>0) {
            nums[i-1][2] = '#069420'
        }
        nums[i][2] = 'yellow'
        drawChart()
        await sleep(SPEED)

        if (nums[i][1] == searchnum) {
            nums[i][2] = 'RoyalBlue'
            drawChart()
            break
        }
    }
}

async function binary(searchnum) {
    var l = 0
    var r = nums.length - 1

    while (l < r) {
        var m = Math.floor((l+r)/2 )
        nums[m][2] = 'yellow'
        drawChart()
        await sleep(SPEED)

        if (nums[m][1] == searchnum) {
            nums[m][2] = "RoyalBlue"
            drawChart()
            break
        } else if (nums[m][1] < searchnum) {
            l = m + 1
        } else {
            r = m - 1
        }
        nums[m][2] = '#069420'
    }
}

function sleep(ms) {
    // pulled from StackOverload. No built in sleep function in js
      return new Promise(resolve => setTimeout(resolve, ms))
}

function bad_sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}