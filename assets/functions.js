const eps = 0.1;
const delay = 1000;
const addition = 0;
let configChart;
let setInt;
let str_function;
let a,aMax;
let b,bMax;
let viewType;

/*
let str_function = 'Math.sin(x)';
let a,aMax = 3;
let b,bMax = 9;  
*/
/*
let str_function = '-Math.pow((x-1),2) + 2*(x-1) + 3';
let a,aMax = -5;
let b,bMax = 10;
*/

function f(x, strf) {
  return eval(strf);
}

let ternarySearchMax = function() {
  if (Math.abs(b - a) < eps) {
    let point = {
      x: a + (b - a) / 2.0,
      fx: f(a + (b - a) / 2.0, str_function)
    };
    console.log(point);
    addDataset(searchNearestPoint(point.x), 8);
    document.getElementById('span-point').innerHTML = `( x = ${point.x},f(x) = ${point.fx} )`;
    clearInterval(setInt);
  }

  let m1 = a + (b - a) / 3.0;
  let m2 = b - (b - a) / 3.0;
  let f1 = f(m1, str_function);
  let f2 = f(m2, str_function);

  if (f1 < f2) {
    if(viewType == '1'){
      let line = interceptionLine({ x: m1, y: f1 },{ x: b, y: f(b, str_function) });
      addDataset(generateRange(m1, b, line, eps), 0);
    }
    else{
      addDataset(generateRange(m1, b, str_function, eps), 0);
    }
    a = m1;
  } else {
    if(viewType == '1'){
      let line = interceptionLine({ x: a, y: f(a, str_function) },{ x: m2, y: f2 });
      addDataset(generateRange(a, m2, line, eps), 0);  
    }
    else{
      addDataset(generateRange(a, m2, str_function, eps), 0);  
    }
    b = m2;
  }
};

let ternarySearchMin = function() {
  if (Math.abs(b - a) < eps) {
    let point = {
      x: a + (b - a) / 2.0,
      fx: f(a + (b - a) / 2.0, str_function)
    };
    console.log(point);
    addDataset(searchNearestPoint(point.x), 8);
    document.getElementById('span-point').innerHTML = `( x = ${point.x},f(x) = ${point.fx} )`;
    clearInterval(setInt);
  }

  let m1 = a + (b - a) / 3.0;
  let m2 = b - (b - a) / 3.0;
  let f1 = f(m1, str_function);
  let f2 = f(m2, str_function);

  if (f1 > f2) {
    if(viewType == '1'){
      let line = interceptionLine({ x: m1, y: f1 },{ x: b, y: f(b, str_function) });
      addDataset(generateRange(m1, b, line, eps), 0);
    }
    else{
      addDataset(generateRange(m1, b, str_function, eps), 0);
    }
    a = m1;
  } else {
    if(viewType == '1'){
      let line = interceptionLine({ x: a, y: f(a, str_function) },{ x: m2, y: f2 });
      addDataset(generateRange(a, m2, line, eps), 0);  
    }
    else{
      addDataset(generateRange(a, m2, str_function, eps), 0);  
    }
    b = m2;
  }

};

function generateColor() {
  let R, G, B;
  const alphaChannel = 1;

  R = Math.floor(Math.random() * 256);
  G = Math.floor(Math.random() * 256);
  B = Math.floor(Math.random() * 256);

  return `rgba(${R},${G},${B},${alphaChannel})`;
}

function searchNearestPoint(x) {
  let data = Array();
  let nearestPoint;
  let lower = 10000000;
  for (let i = aMax - addition; i <= bMax + addition; i += eps)
    data[`x:${i}`] = NaN;

  for (let i = aMax - addition; i <= bMax + addition; i += eps) {
    if (Math.abs(Math.abs(x) - Math.abs(i)) < lower && x * i > 0) {
      lower = Math.abs(Math.abs(x) - Math.abs(i));
      nearestPoint = i;
    }
  }
  console.log(lower, nearestPoint);
  data[`x:${nearestPoint}`] = f(nearestPoint, str_function);
  return data;
}

function generateRange(aRange, bRange, strf, step) {
  let points = Array();

  for (let x = aMax - addition; x < aRange - addition; x += step) {
    points[`x:${x}`] = NaN;
  }

  for (let x = aRange - addition; x <= bRange + addition; x += step) {
    points[`x:${x}`] = f(x, strf);
  }

  for (let x = bRange + addition; x < bMax + addition; x += step) {
    points[`x:${x}`] = NaN;
  }

  return points;
}

function createConfigChart(field, data) {
  const x = Object.keys(data);
  const fx = Object.values(data);

  configChart = {
    type: "line",
    data: {
      datasets: [
        {
          data: fx,
          backgroundColor: "red",
          borderColor: "red",
          radius: 0,
          fill: false
        }
      ],
      labels: x
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: field
      }
    }
  };

  return configChart;
}

function interceptionLine(p1, p2) {
  let m = (p2.y - p1.y) / (p2.x - p1.x);
  let b = p1.y - m * p1.x;
  return `${m}*x + ${b}`;
}

function addDataset(data, radius) {
  let color = generateColor();
  let newDataset = {
    data: [],
    backgroundColor: color,
    borderColor: color,
    borderWidth: 5,
    radius: radius,
    fill: false
  };

  newDataset.data = Object.values(data);
  configChart.data.datasets.unshift(newDataset);
  window.myLine.update();
}

function search() {
  str_function = $("#function").val();
  aMax = parseInt($("#minrange").val());;
  bMax = parseInt($("#maxrange").val());
  viewType = $("#view-type").val();
  const pointType = $("#ptype").val();
  a = aMax;
  b = bMax;
  console.log(viewType);
  
  let points = generateRange(a, b, str_function, eps);
  let config = createConfigChart(str_function, points);
  let ctx = document.getElementById("chart-area").getContext("2d");
  window.myLine = new Chart(ctx, config);
  switch (pointType) {
    case "1": {
      setInt = setInterval(ternarySearchMax, delay);
      break;
    }
    case "2": {
      setInt = setInterval(ternarySearchMin, delay);
      break;
    }
    default:
      setInt = setInterval(ternarySearchMax, delay);
  }
}
