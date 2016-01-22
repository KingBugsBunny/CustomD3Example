'use strict';

var data = {
    width: 2,
    height: 8.5,
    headerHeight: 1.5,
    name: 'C. C. Sample',
    //type: pgc.SurveyType.ProScan,
    results: [
        5, 4, 4, 5, 2,
        3, 5, 4, 3, 3,
        4, 5, 3, 3, 3,
        4, 5, 3, 3, 3,
        3, 3, 4, 4, 5,
        4, 5, 4, 5, 5,
        5, 5, 3, 5, 5,
        5, 5, 2, 5, 5,
        2, 5, 5, 5, 5,
        4, 3, 3, 3, 2,
        5, 5, 4, 5, 4,
        3, 5, 4, 5, 4
    ],
    expectations: {
        basic: {
            dominance: 225,
            extroversion: 292,
            pace: 592,
            conformity: 554,
            norm: 408,
            logic: 342,
            thrust: 275,
            allegiance: 573,
            stenacity: 409,
            kinetic: 543,
            ref: 424
        },
        priority: {
            dominance: 396,
            extroversion: 558,
            pace: 588,
            conformity: 515,
            norm: 492,
            logic: 479,
            thrust: 496,
            allegiance: 569,
            stenacity: 510,
            kinetic: 574,
            ref: 532
        },
        predictor: {
            dominance: 283,
            extroversion: 469,
            pace: 608,
            conformity: 530,
            norm: 445,
            logic: 413,
            thrust: 455,
            allegiance: 568,
            stenacity: 485,
            kinetic: 567,
            ref: 511
        },
        dominance: {
            base: 309,
            length: 87,
            crosses: false
        },
        extroversion: {
            base: 376,
            length: 182,
            crosses: true
        },
        pace: {
            base: 676,
            length: -88,
            crosses: false
        },
        conformity: {
            base: 638,
            length: -123,
            crosses: false
        },
        logic: {
            base: 450,
            length: 29,
            crosses: false
        },
        kinetic: {
            base: 402,
            length: -172,
            crosses: false
        },
        satisfaction: {
            base: 424,
            length: 108,
            level: 'H'
        }
    }
};

//title array
var textTitles = [
    'Dominance',
    'Extroversion',
    'Pace/Patience',
    'Conformity',
    'Logic',
    'Energy Style',
    'Kinetic Energy'
];


function renderBasicChart(data) {

    var data = data;

    // color initialisation
    var colorBlue1 = '#0f4f6b',
        colorBlue2 = '#b7cde2';

//define step variables
    var laneStep = data.width / textTitles.length;

//create scales
    var norm = (data.height * 100) - data.expectations.basic.norm,
        sigmaTickOriginPoint = norm;

    while(sigmaTickOriginPoint > data.headerHeight) {
        sigmaTickOriginPoint -= 100;

    }
    sigmaTickOriginPoint += 100;
    sigmaTickOriginPoint = norm - data.headerHeight - (norm - sigmaTickOriginPoint);

// canvas
    var svg = d3.select('body')
        .classed('svg-container', true)
        .append('svg')
        .attr('viewBox', '0 0 ' + (data.width + 0.05) * 100 + ' ' + (data.height + 0.05) * 100 + '')
        .classed('svg-content-responsive', true);

//data parsing
    var depcArray = [],
        tasArray = [],
        thirtyItemArray = data.results.slice();

    thirtyItemArray = thirtyItemArray.slice(0,29);

    //assign data from data.expectations.basic so it can be assigned to other arrays
    for (var k in data.expectations.basic) {
        if (data.expectations.basic.hasOwnProperty(k)) {
            depcArray.push(data.expectations.basic[k]);
        }
    }
    tasArray = depcArray.splice(4, 7);
    tasArray.splice(0, 2);
    tasArray.splice(3, 2);

// Metadata
    svg.append('desc').text('PDP Global Chart');
    svg.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', data.width - 0.005 + 'in')
        .attr('height', data.height - 0.005 + 'in')
        .attr('x', '0.025in')
        .attr('y', '0.025in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'white');

// Background surface
    svg.append('rect')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .attr('x', '0.0125in')
        .attr('y', '0.0125in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'white');

    //render ruler ticks
    svg.append('g').selectAll('rulerTicks').data(textTitles).enter().append('line')
        .attr('class', 'ruler')
        .attr('x1', '1.75in')
        .attr('y1', function (d, i) {
            return i + 1.50 + 'in';
        })
        .attr('x2', '1.95' + 'in')
        .attr('y2', function (d, i) {
            return i + 1.50 + 'in';
        })
        .style('stroke', '#999')
        .style('stroke-width', '0.01in');

    //render ruler numbers
    svg.append('g').selectAll('ruler').data(textTitles).enter().append('text')
        .attr('class', 'rulerNumbers')
        .attr('x', '1.8in')
        .attr('y', function (d, i) {
            return i + 2.05 + 'in'
        })
        .style('fill', '#999')
        .text(function (d, i) {
            return (i - 7) * -1;
        });

    //main chart logic

    //render DEPC bars
    //if negative
    svg.append('g').selectAll('depcBarsUp').data(depcArray).enter().append('rect')
        .attr('class', 'depcBars')
        .attr('x', function (d, i) {
            return (laneStep * i + .01) + 'in'
        })
        .attr('y', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('width', (laneStep - 0.01) + 'in')
        .attr('height', function (d) {
            if (d - norm > 0)
                return (d - data.expectations.basic.norm) / 100 + 'in'
        })
        .style('fill', colorBlue2);

    //if positive
    svg.append('g').selectAll('depcBarsDown').data(depcArray).enter().append('rect')
        .attr('class', 'depcBars')
        .attr('x', function (d, i) {
            return (laneStep * i + .01) + 'in'
        })
        .attr('y', norm / 100 + 'in')
        .attr('width', (laneStep - 0.01) + 'in')
        .attr('height', function (d) {
            if (d - norm < 0)
                return (d - data.expectations.basic.norm) * -1 / 100 + 'in'
        })
        .style('fill', colorBlue2);


    //render DEPC circles
    svg.append('g').selectAll('circles').data(depcArray).enter().append('circle')
        .attr('cx', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in'
        })
        .attr('cy', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', colorBlue1);

    //render DEPC line connections
    svg.append('g').selectAll('depcLines').data(depcArray).enter().append('line')
        .attr('class', 'depcLines')
        .attr('x1', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in'
        })
        .attr('y1', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('x2', function (d, i) {
            return (laneStep * (i + 2.0) - laneStep / 2.0) + 'in'
        })
        .attr('y2', function (d, i) {
            if (depcArray[i + 1]) {
                return (data.height * 100 - depcArray[i + 1]) / 100 + 'in'
            }
        })
        .style('stroke', function (d, i) {
            if (i < 3) {
                return colorBlue1
            }
        })
        .style('stroke-width', '0.03in');

    //render Logic Bar
    //TODO: cant go negative
    //if positive
    if ((data.expectations.basic.ref - data.expectations.basic.logic) < 0) {
        svg.append('g').append('rect')
            .attr('class', 'logicBar')
            .attr('x', (laneStep * 5 - laneStep) + 'in')
            .attr('y', (data.height - (data.expectations.basic.logic / 100) + 'in'))
            .attr('height', (data.expectations.basic.ref - data.expectations.basic.logic) / 100 + 'in')
            .attr('width', (laneStep - 0.01) + 'in')
            .style('fill', colorBlue2);
    } else {
        //if negative
        svg.append('g').append('rect')
            .attr('class', 'logicBar')
            .attr('x', (laneStep * 5 - laneStep) + 'in')
            .attr('y', ((data.height * 100) - data.expectations.basic.ref) / 100 + 'in')
            .attr('height', (data.expectations.basic.ref - data.expectations.basic.logic) / 100 + 'in')
            .attr('width', (laneStep - 0.01) + 'in')
            .style('fill', colorBlue2);
    }
    //render Logic circle
    svg.append('g').append('circle')
        .attr('cx', laneStep * (5) - laneStep / 2.0 + 'in')
        .attr('cy', data.height - (data.expectations.basic.logic / 100) + 'in')
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', '#fff')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.025in');

    //render logic text
    svg.append('g').append('text')
        .attr('x', (laneStep * (4 + 1.0) - laneStep / 2.0) + 'in')
        .attr('y', data.height - (data.expectations.basic.logic / 100) + .05 + 'in')
        .style('fill', colorBlue1)
        .style('font-size', '10px')
        .style('text-anchor', 'middle')
        .text(function () {
            if (data.expectations.basic.ref > data.expectations.basic.logic) {
                return 'FEL'
            } else {
                return 'BAL'
            }
        });

    //render logic line
    svg.append('g')
        .append('line')
        .attr('class', 'normLine')
        .attr('x1', (laneStep * 5) + 'in')
        .attr('y1', ((data.height * 100) - data.expectations.basic.ref) / 100 + 'in')
        .attr('x2', (laneStep * 4) + 'in')
        .attr('y2', ((data.height * 100) - data.expectations.basic.ref) / 100 + 'in')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.04in');

    //render TAS circles
    svg.append('g').selectAll('circles').data(tasArray).enter().append('circle')
        .attr('cx', (laneStep * (5 + 1.0) - laneStep / 2.0) + 'in')
        .attr('cy', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', '#fff')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.025in');

    //render TAS text
    svg.append('g').selectAll('text').data(tasArray).enter().append('text')
        .attr('x', (laneStep * 6 - laneStep / 2.0) + 'in')
        .attr('y', function (d) {
            return data.height - (d / 100) + .05 + 'in'
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('text-anchor', 'middle')
        .text(function (d, i) {
            if (i < 1) {
                return 'T'
            } else if (i > 1) {
                return 'S'
            } else {
                return 'A'
            }
        })
        .attr('fill', colorBlue1);

    //render norm line
    svg.append('g').append('line')
        .attr('class', 'normLine')
        .attr('x1', '0in')
        .attr('y1', norm / 100 + 'in')
        .attr('x2', ((laneStep * 4) + 'in'))
        .attr('y2', norm / 100 + 'in')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.04in');

    //render kinetic diamond
    svg.append("g").append("path")
        .attr("d", d3.svg.symbol()
            .size(function () {
                return 22 * 22
            })
            .type(function () {
                return "diamond"
            }))
        .attr("transform", "translate(" + (laneStep * 6 + .07) * 100 + ", " + (data.height * 100 - data.expectations.basic.kinetic) + ")")
        .style('fill', 'transparent')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.02in');

    //render diamond text
    svg.append('g').append('text')
        .attr('x', (laneStep * 6 + 0.1) + 'in')
        .attr('y', (data.height * 100 - data.expectations.basic.kinetic + 17) / 100 + 'in')
        .text('k')
        .style('fill', colorBlue1);

    //render sigma ticks
    //grabs data.results as it needs to run possibly 15 times or more
    svg.append('g').selectAll('sigmaTicksUp').data(thirtyItemArray).enter().append('line')
        .attr('class', 'sigmaTicks')
        .attr('x1', '0in')
        .attr('y1', function (d, i) {
            var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
            if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height) {
                return tickToRender + 'in';
            }
            return -30;
        })
        .attr('x2', '.1in')
        .attr('y2', function (d, i) {
            var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
            if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height)
                return tickToRender + 'in';
        })
        .style('stroke', '#999')
        .style('stroke-width', function (d, i) {
            return i % 2 == 0 ? '0in' : '0.01in'
        });

    // render line below headers
    svg.append('line')
        .attr('x1', '0in')
        .attr('y1', data.headerHeight + 'in')
        .attr('x2', data.width + 'in')
        .attr('y2', data.headerHeight + 'in')
        .style('stroke', '#000')
        .style('stroke-width', '0.01in');

    // render titles
    svg.append('g').selectAll('words').data(textTitles).enter()
        .append('text')
        .attr('class', 'titles')
        .attr('x', data.headerHeight - 0.1 + 'in')
        .attr('y', function (d, i) {
            return (laneStep * i) + 0.05 + 'in';
        })
        .style('fill', '#000')
        .attr('transform', 'rotate(-90, 0, 0), translate(-272, 13)')
        .text(function (d) {
            return d;
        });

// Render lanes
    svg.append('g').selectAll('laneLines').data(textTitles).enter().append('line')
        .attr('x1', function (d, i) {
            return laneStep * (i + 1.0) + 'in';
        })
        .attr('y1', '0.025in')
        .attr('x2', function (d, i) {
            return laneStep * (i + 1.0) + 'in';
        })
        .attr('y2', data.height + 'in')
        .style('stroke', function (d, i) {
            return i === 3 || i === 4 ? '#000' : '#999'
        })
        .style('stroke-width', function (d, i) {
            return i === 6 ? '0.00in' : '0.01in';
        });


    // render chart border
    svg.append('rect')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .attr('x', '0.0125in')
        .attr('y', '0.0125in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'transparent')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.025in');

}

function renderPredictorChart(data) {
    var data = data;

    // color initialisation
    var colorGreen1 = '#006838',
        colorGreen2 = '#8DC63F';

//define step variables
    var laneStep = data.width / textTitles.length;

//create scales
    var norm = (data.height * 100) - data.expectations.predictor.norm,
        sigmaTickOriginPoint = norm;

    while(sigmaTickOriginPoint > data.headerHeight) {
        sigmaTickOriginPoint -= 100;

    }
    sigmaTickOriginPoint += 100;
    sigmaTickOriginPoint = norm - data.headerHeight - (norm - sigmaTickOriginPoint);

// canvas
    var svg = d3.select('body')
        .classed('svg-container', true)
        .append('svg')
        .attr('viewBox', '0 0 ' + (data.width + 0.02) * 100 + ' ' + (data.height + 0.02) * 100 + '')
        .classed('svg-content-responsive', true);

//data parsing
    var depcArray = [],
        tasArray = [],
        thirtyItemArray = data.results.slice();

    thirtyItemArray = thirtyItemArray.slice(0,29);

    //assign data from data.expectations.predictor so it can be assigned to other arrays
    for (var k in data.expectations.predictor) {
        if (data.expectations.predictor.hasOwnProperty(k)) {
            depcArray.push(data.expectations.predictor[k]);
        }
    }
    tasArray = depcArray.splice(4, 7);
    tasArray.splice(0, 2);
    tasArray.splice(3, 2);

// Metadata
    svg.append('desc').text('PDP Global Chart');
    svg.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', data.width - 0.005 + 'in')
        .attr('height', data.height - 0.005 + 'in')
        .attr('x', '0.025in')
        .attr('y', '0.025in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'white');

// Background surface
    svg.append('rect')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .attr('x', '0.0125in')
        .attr('y', '0.0125in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'white');

    //render ruler ticks
    svg.append('g').selectAll('rulerTicks').data(textTitles).enter().append('line')
        .attr('class', 'ruler')
        .attr('x1', '1.75in')
        .attr('y1', function (d, i) {
            return i + 1.50 + 'in';
        })
        .attr('x2', '1.95' + 'in')
        .attr('y2', function (d, i) {
            return i + 1.50 + 'in';
        })
        .style('stroke', '#999')
        .style('stroke-width', '0.01in');

    //render ruler numbers
    svg.append('g').selectAll('ruler').data(textTitles).enter().append('text')
        .attr('class', 'rulerNumbers')
        .attr('x', '1.8in')
        .attr('y', function (d, i) {
            return i + 2.05 + 'in'
        })
        .style('fill', '#999')
        .text(function (d, i) {
            return (i - 7) * -1;
        });

    //main chart logic

    //render DEPC bars
    //if negative
    svg.append('g').selectAll('depcBarsUp').data(depcArray).enter().append('rect')
        .attr('class', 'depcBars')
        .attr('x', function (d, i) {
            return (laneStep * i + .01) + 'in'
        })
        .attr('y', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('width', (laneStep - 0.01) + 'in')
        .attr('height', function (d) {
            if (d - norm > 0)
                return (d - data.expectations.predictor.norm) / 100 + 'in'
        })
        .style('fill', colorGreen2);

    //if positive
    svg.append('g').selectAll('depcBarsDown').data(depcArray).enter().append('rect')
        .attr('class', 'depcBars')
        .attr('x', function (d, i) {
            return (laneStep * i + .01) + 'in'
        })
        .attr('y', norm / 100 + 'in')
        .attr('width', (laneStep - 0.01) + 'in')
        .attr('height', function (d) {
            if (d - norm < 0)
                return (d - data.expectations.predictor.norm) * -1 / 100 + 'in'
        })
        .style('fill', colorGreen2);


    //render DEPC circles
    svg.append('g').selectAll('circles').data(depcArray).enter().append('circle')
        .attr('cx', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in'
        })
        .attr('cy', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', colorGreen1);

    //render DEPC line connections
    svg.append('g').selectAll('depcLines').data(depcArray).enter().append('line')
        .attr('class', 'depcLines')
        .attr('x1', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in'
        })
        .attr('y1', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('x2', function (d, i) {
            return (laneStep * (i + 2.0) - laneStep / 2.0) + 'in'
        })
        .attr('y2', function (d, i) {
            if (depcArray[i + 1]) {
                return (data.height * 100 - depcArray[i + 1]) / 100 + 'in'
            }
        })
        .style('stroke', function (d, i) {
            if (i < 3) {
                return colorGreen1
            }
        })
        .style('stroke-width', '0.03in');

    //render Logic Bar
    //TODO: cant go negative
    //if positive
    if ((data.expectations.predictor.ref - data.expectations.predictor.logic) < 0) {
        svg.append('g').append('rect')
            .attr('class', 'logicBar')
            .attr('x', (laneStep * 5 - laneStep) + 'in')
            .attr('y', (data.height - (data.expectations.predictor.logic / 100) + 'in'))
            .attr('height', (data.expectations.predictor.ref - data.expectations.predictor.logic) / 100 + 'in')
            .attr('width', (laneStep - 0.01) + 'in')
            .style('fill', colorGreen2);
    } else {
        //if negative
        svg.append('g').append('rect')
            .attr('class', 'logicBar')
            .attr('x', (laneStep * 5 - laneStep) + 'in')
            .attr('y', ((data.height * 100) - data.expectations.predictor.ref) / 100 + 'in')
            .attr('height', (data.expectations.predictor.ref - data.expectations.predictor.logic) / 100 + 'in')
            .attr('width', (laneStep - 0.01) + 'in')
            .style('fill', colorGreen2);
    }
    //render Logic circle
    svg.append('g').append('circle')
        .attr('cx', laneStep * (5) - laneStep / 2.0 + 'in')
        .attr('cy', data.height - (data.expectations.predictor.logic / 100) + 'in')
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', '#fff')
        .style('stroke', colorGreen1)
        .style('stroke-width', '0.025in');

    //render logic text
    svg.append('g').append('text')
        .attr('x', (laneStep * (4 + 1.0) - laneStep / 2.0) + 'in')
        .attr('y', data.height - (data.expectations.predictor.logic / 100) + .05 + 'in')
        .style('fill', colorGreen1)
        .style('font-size', '10px')
        .style('text-anchor', 'middle')
        .text(function () {
            if (data.expectations.predictor.ref > data.expectations.predictor.logic) {
                return 'FEL'
            } else {
                return 'BAL'
            }
        });

    //render logic line
    svg.append('g')
        .append('line')
        .attr('class', 'normLine')
        .attr('x1', (laneStep * 5) + 'in')
        .attr('y1', ((data.height * 100) - data.expectations.predictor.ref) / 100 + 'in')
        .attr('x2', (laneStep * 4) + 'in')
        .attr('y2', ((data.height * 100) - data.expectations.predictor.ref) / 100 + 'in')
        .style('stroke', colorGreen1)
        .style('stroke-width', '0.04in');

    //render TAS circles
    svg.append('g').selectAll('circles').data(tasArray).enter().append('circle')
        .attr('cx', (laneStep * (5 + 1.0) - laneStep / 2.0) + 'in')
        .attr('cy', function (d) {
            return data.height - (d / 100) + 'in'
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', '#fff')
        .style('stroke', colorGreen1)
        .style('stroke-width', '0.025in');

    //render TAS text
    svg.append('g').selectAll('text').data(tasArray).enter().append('text')
        .attr('x', (laneStep * 6 - laneStep / 2.0) + 'in')
        .attr('y', function (d) {
            return data.height - (d / 100) + .05 + 'in'
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('text-anchor', 'middle')
        .text(function (d, i) {
            if (i < 1) {
                return 'T'
            } else if (i > 1) {
                return 'S'
            } else {
                return 'A'
            }
        })
        .attr('fill', colorGreen1);

    //render norm line
    svg.append('g').append('line')
        .attr('class', 'normLine')
        .attr('x1', '0in')
        .attr('y1', norm / 100 + 'in')
        .attr('x2', ((laneStep * 4) + 'in'))
        .attr('y2', norm / 100 + 'in')
        .style('stroke', colorGreen1)
        .style('stroke-width', '0.04in');

    //render kinetic diamond
    svg.append("g").append("path")
        .attr("d", d3.svg.symbol()
            .size(function () {
                return 22 * 22
            })
            .type(function () {
                return "diamond"
            }))
        .attr("transform", "translate(" + (laneStep * 6 + .07) * 100 + ", " + (data.height * 100 - data.expectations.predictor.kinetic) + ")")
        .style('fill', 'transparent')
        .style('stroke', colorGreen1)
        .style('stroke-width', '0.02in');

    //render diamond text
    svg.append('g').append('text')
        .attr('x', (laneStep * 6 + 0.1) + 'in')
        .attr('y', (data.height * 100 - data.expectations.predictor.kinetic + 17) / 100 + 'in')
        .text('k')
        .style('fill', colorGreen1);

    //render sigma ticks
    //grabs data.results as it needs to run possibly 15 times or more
    svg.append('g').selectAll('sigmaTicksUp').data(thirtyItemArray).enter().append('line')
        .attr('class', 'sigmaTicks')
        .attr('x1', '0in')
        .attr('y1', function (d, i) {
            var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
            if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height) {
                return tickToRender + 'in';
            }
            return -30;
        })
        .attr('x2', '.1in')
        .attr('y2', function (d, i) {
            var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
            if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height)
                return tickToRender + 'in';
        })
        .style('stroke', '#999')
        .style('stroke-width', function (d, i) {
            return i % 2 == 0 ? '0in' : '0.01in'
        });


    // render line below headers
    svg.append('line')
        .attr('x1', '0in')
        .attr('y1', data.headerHeight + 'in')
        .attr('x2', data.width + 'in')
        .attr('y2', data.headerHeight + 'in')
        .style('stroke', '#000')
        .style('stroke-width', '0.01in');

    // render titles
    svg.append('g').selectAll('words').data(textTitles).enter()
        .append('text')
        .attr('class', 'titles')
        .attr('x', data.headerHeight - 0.1 + 'in')
        .attr('y', function (d, i) {
            return (laneStep * i) + 0.05 + 'in';
        })
        .style('fill', '#000')
        .attr('transform', 'rotate(-90, 0, 0), translate(-272, 13)')
        .text(function (d) {
            return d;
        });

    // Render lanes
    svg.append('g').selectAll('laneLines').data(textTitles).enter().append('line')
        .attr('x1', function (d, i) {
            return laneStep * (i + 1.0) + 'in';
        })
        .attr('y1', '0.025in')
        .attr('x2', function (d, i) {
            return laneStep * (i + 1.0) + 'in';
        })
        .attr('y2', data.height + 'in')
        .style('stroke', function (d, i) {
            return i === 3 || i === 4 ? '#000' : '#999'
        })
        .style('stroke-width', function (d, i) {
            return i === 6 ? '0.00in' : '0.01in';
        });

    // render chart border
    svg.append('rect')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .attr('x', '0.0125in')
        .attr('y', '0.0125in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'transparent')
        .style('stroke', colorGreen1)
        .style('stroke-width', '0.025in');

}

function renderPriorityChart(data) {

    var data = data;
    // color initialisation
    var colorRed = '#BE1E2D',
        colorBlue = '#0f4f6b';

//define step variables
    var laneStep = data.width / textTitles.length;

//create scales
    var norm = (data.height * 100) - data.expectations.priority.norm,
        sigmaTickOriginPoint = norm;

    while(sigmaTickOriginPoint > data.headerHeight) {
        sigmaTickOriginPoint -= 100;

    }
    sigmaTickOriginPoint += 100;
    sigmaTickOriginPoint = norm - data.headerHeight - (norm - sigmaTickOriginPoint);

    //Init Name Array
    var titleArray = [
        'Dominance',
        'Extroversion',
        'Pace/Patience',
        'Conformity',
        'Logic',
        'Satisfaction',
        'Energy Drain'
    ];

    var satisfactionTriangleSize = 15,
        depcTriangleSize = 12;

// canvas
    var svg = d3.select('body')
        .classed('svg-container', true)
        .append('svg')
        .attr('viewBox', '0 0 ' + (data.width + 0.05) * 100 + ' ' + (data.height + 0.05) * 100 + '')
        .classed('svg-content-responsive', true);

//data parsing
    var depcArray = [],
        arrowOriginArray = [],
        arrowLineLength = [],
        thirtyItemArray = data.results.slice();

    thirtyItemArray = thirtyItemArray.slice(0,29);;

    //assign data from data.expectations.priority so it can be assigned to other arrays
    for (var k in data.expectations.priority) {
        if (data.expectations.priority.hasOwnProperty(k)) {
            depcArray.push(data.expectations.priority[k]);
        }
    }

    depcArray = depcArray.splice(0, 4);

    for (var k in data.expectations) {
        if (data.expectations.hasOwnProperty(k)) {
            arrowOriginArray.push(data.expectations[k].base);
            arrowLineLength.push(data.expectations[k].length);
        }
    }
    arrowLineLength = arrowLineLength.splice(3, 9);
    arrowOriginArray = arrowOriginArray.splice(3, 9);


// Metadata
    svg.append('desc').text('PDP Global Chart');
    svg.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', data.width - 0.005 + 'in')
        .attr('height', data.height - 0.005 + 'in')
        .attr('x', '0.025in')
        .attr('y', '0.025in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'white');

// Background surface
    svg.append('rect')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .attr('x', '0.0125in')
        .attr('y', '0.0125in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'white');

// Render lanes
    svg.append('g').selectAll('laneLines').data(titleArray).enter().append('line')
        .attr('x1', function (d, i) {
            return laneStep * (i + 1.0) + 'in';
        })
        .attr('y1', '0.025in')
        .attr('x2', function (d, i) {
            return laneStep * (i + 1.0) + 'in';
        })
        .attr('y2', data.height + 'in')
        .style('stroke', function (d, i) {
            return i === 3 || i === 4 ? '#000' : '#999';
        })
        .style('stroke-width', function (d, i) {
            return i === 6 ? '0.00in' : '0.01in';
        });

    //render ruler ticks
    svg.append('g').selectAll('rulerTicks').data(titleArray).enter().append('line')
        .attr('class', 'ruler')
        .attr('x1', '1.75in')
        .attr('y1', function (d, i) {
            return i + 1.50 + 'in';
        })
        .attr('x2', '1.95' + 'in')
        .attr('y2', function (d, i) {
            return i + 1.50 + 'in';
        })
        .style('stroke', '#999')
        .style('stroke-width', '0.01in');

    //render ruler numbers
    svg.append('g').selectAll('ruler').data(titleArray).enter().append('text')
        .attr('class', 'rulerNumbers')
        .attr('x', '1.8in')
        .attr('y', function (d, i) {
            return i + 2.05 + 'in';
        })
        .style('fill', '#999')
        .text(function (d, i) {
            return (i - 7) * -1;
        });

    //main chart logic

    //render DEPC circles
    svg.append('g').selectAll('circles').data(depcArray).enter().append('circle')
        .attr('cx', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in';
        })
        .attr('cy', function (d) {
            return data.height - (d / 100) + 'in';
        })
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', colorRed);

    //render Logic circle
    svg.append('g').append('circle')
        .attr('cx', laneStep * (5) - laneStep / 2.0 + 'in')
        .attr('cy', data.height - (data.expectations.priority.logic / 100) + 'in')
        .attr('r', (laneStep / 2 - 0.025) + 'in')
        .style('fill', colorRed);

    //render logic line
    svg.append('g')
        .append('line')
        .attr('class', 'normLine')
        .attr('x1', (laneStep * 5) + 'in')
        .attr('y1', ((data.height * 100) - data.expectations.priority.ref) / 100 + 'in')
        .attr('x2', (laneStep * 4) + 'in')
        .attr('y2', ((data.height * 100) - data.expectations.priority.ref) / 100 + 'in')
        .style('stroke', colorRed)
        .style('stroke-width', '0.04in');

    //render logic arrow head
    svg.append('g').append('path')
        .attr("d", d3.svg.symbol()
            .size(function () {
                return depcTriangleSize * depcTriangleSize;
            })
            .type(function () {
                if (data.expectations.logic.base < data.expectations.priority.norm) {
                    return 'triangle-up';
                } else {
                    return 'triangle-down';
                }
            }))
        .attr("transform", function () {
            if (data.expectations.logic.base > data.expectations.priority.norm) {
                return "translate(" + (laneStep * 4 + laneStep / 3) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.logic) + ")"
            } else {
                return "translate(" + ((laneStep * 4 + laneStep / 3)) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.logic) + ")"
            }
        })
        .style('fill', colorRed);

    //render norm line
    svg.append('g').append('line')
        .attr('class', 'normLine')
        .attr('x1', '0in')
        .attr('y1', norm / 100 + 'in')
        .attr('x2', ((laneStep * 4) + 'in'))
        .attr('y2', norm / 100 + 'in')
        .style('stroke', colorRed)
        .style('stroke-width', '0.04in');

    //render depc arrow lines
    svg.append('g').selectAll('depcLines').data(arrowLineLength).enter()
        .append('line')
        .attr('class', 'depcLines')
        .attr('x1', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in';
        })
        .attr('y1', function (d, i) {
            if (depcArray[i]) {
                if (arrowOriginArray[i] > data.expectations.priority.norm) {
                    return (data.height * 100 - arrowOriginArray[i]) / 100 + 'in';
                }
                else {
                    return (data.height * 100 - depcArray[i] + 20) / 100 + 'in';
                }
            }
        })
        .attr('x2', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in';
        })
        .attr('y2', function (d, i) {
            if (depcArray[i]) {
                if (arrowOriginArray[i] < data.expectations.priority.norm) {
                    return (data.height * 100 - arrowOriginArray[i]) / 100 + 'in';
                } else {
                    return (data.height * 100 - depcArray[i] - 20) / 100 + 'in';
                }
            }
        })
        .style('stroke', function (d, i) {
            if (depcArray[i]) {
                return colorRed;
            }
        })
        .style('stroke-width', '0.04in');

    // render logic arrow line
    svg.append('g')
        .append('line')
        .attr('class', 'logicArrowLine')
        .attr('x1', function () {
            return (laneStep * (5) - laneStep / 2.0) + 'in';
        })
        .attr('y1', function () {
            return data.height - (data.expectations.logic.base / 100) + 'in';
        })
        .attr('x2', function () {
            return (laneStep * (5) - laneStep / 2.0) + 'in';
        })
        .attr('y2', function () {
            if (data.expectations.logic.length > 0) {
                return ((data.height * 100 - data.expectations.logic.base) - data.expectations.logic.length) / 100 + 'in';
            } else {
                return ((data.height * 100 - data.expectations.logic.base) - data.expectations.logic.length * -1) / 100 + 'in';
            }
        })
        .style('stroke', function (d, i) {
            if (depcArray[i]) {
                return colorRed;
            }
        })
        .style('stroke-width', '0.04in');

    //render arrow origin point
    svg.append('g').selectAll('circles').data(arrowOriginArray).enter().append('circle')
        .attr('cx', function (d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in';
        })
        .attr('cy', function (d) {
            return data.height - (d / 100) + 'in';
        })
        .attr('r', function (d, i) {
            if (i < 5) {
                return (laneStep / 4 - 0.025) + 'in';
            }
        })
        .style('fill', colorBlue);

    //render depc Arrow heads
    //dominance
    svg.append('path')
        .attr("d", d3.svg.symbol()
            .size(function () {
                return depcTriangleSize * depcTriangleSize;
            })
            .type(function () {
                if (data.expectations.dominance.length > 0) {
                    return 'triangle-up';
                } else {
                    return 'triangle-down';
                }
            }))
        .attr("transform", function (d, i) {
            if (arrowLineLength[i] > 0) {
                return "translate(" + (laneStep / 2.2) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.dominance) + ")"
            } else {
                return "translate(" + ((laneStep / 2.2)) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.dominance + 5) + ")"
            }
        })
        .style('fill', colorRed);

//extroversion
    svg.append('path')
        .attr("d", d3.svg.symbol()
            .size(function () {
                return depcTriangleSize * depcTriangleSize;
            })
            .type(function () {
                if (data.expectations.extroversion.length > 0) {
                    return 'triangle-up';
                } else {
                    return 'triangle-down';
                }
            }))
        .attr("transform", function (d, i) {
            if (arrowLineLength[i] > 0) {
                return "translate(" + ( laneStep + laneStep / 2.5) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.extroversion + 5) + ")"
            } else {
                return "translate(" + ((laneStep + laneStep / 2.5)) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.extroversion - 5) + ")"
            }
        })
        .style('fill', colorRed);

    //conformity
    svg.append('path')
        .attr("d", d3.svg.symbol()
            .size(function () {
                return depcTriangleSize * depcTriangleSize;
            })
            .type(function () {
                if (data.expectations.conformity.length > 0) {
                    return 'triangle-up';
                } else {
                    return 'triangle-down';
                }
            }))
        .attr("transform", function (d, i) {
            if (arrowLineLength[i] > 0) {
                return "translate(" + ( laneStep * 3 + laneStep / 2.7) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.conformity - 30) + ")"
            } else {
                return "translate(" + ((laneStep * 3 + laneStep / 2.7)) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.conformity + 25) + ")"
            }
        })
        .style('fill', colorRed);

    //pace
    svg.append('path')
        .attr("d", d3.svg.symbol()
            .size(function () {
                return depcTriangleSize * depcTriangleSize;
            })
            .type(function () {
                if (data.expectations.pace.length > 0) {
                    return 'triangle-up';
                } else {
                    return 'triangle-down';
                }
            }))
        .attr("transform", function (d, i) {
            if (arrowLineLength[i] > 0) {
                return "translate(" + ( laneStep * 2 + laneStep / 2.5) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.pace - 26) + ")"
            } else {
                return "translate(" + ((laneStep * 2 + laneStep / 2.5)) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.pace) + ")"
            }
        })
        .style('fill', colorRed);

    //render satisfaction triangle
    svg.append('g').append('path')
        .attr("d", d3.svg.symbol()
            .size(function () {
                return satisfactionTriangleSize * satisfactionTriangleSize;
            })
            .type(function () {
                if (data.expectations.satisfaction.level == 'H') {
                    return 'triangle-up';
                } else {
                    return 'triangle-down';
                }
            }))
        .attr("transform", function () {
            if (data.expectations.satisfaction.base > data.expectations.priority.norm) {
                return "translate(" + (laneStep * 5 + laneStep / 3.5) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.norm - satisfactionTriangleSize) + ")"
            } else {
                return "translate(" + ((laneStep * 5 + laneStep / 3.5)) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.norm - satisfactionTriangleSize) + ")"
            }
        })
        .style('fill', colorRed);

    //render satisfaction text (HI or LO)
    svg.append('g').append('text')
        .attr('x', function () {
            if (data.expectations.satisfaction.level == 'H') {
                return (laneStep * 5 + laneStep / 8) * 100
            } else {
                return (laneStep * 5 + laneStep / 15) * 100
            }
        })
        .attr('y', function () {
            if (data.expectations.satisfaction.level == 'H') {
                return (data.height * 100 - data.expectations.priority.norm - satisfactionTriangleSize * 1.8) / 100 + 'in';
            } else {
                return (data.height * 100 - data.expectations.priority.norm + satisfactionTriangleSize * 1.3)  / 100 + 'in';
            }
        })
        .text(function () {
            if (data.expectations.satisfaction.level == 'H') {
                return 'HI'
            } else {
                return 'LO'
            }
        })
        .style('font-size', '10')
        .style('fill', colorRed);

    //render satisfaction text (SAT)
    svg.append('g').append('text')
        .attr('x', (laneStep * 5 + laneStep / 1000) * 100)
        .attr('y', function () {
            if (data.expectations.satisfaction.level == 'H') {
                return (data.height * 100 - data.expectations.priority.norm - satisfactionTriangleSize)  / 100 + 'in';
            } else {
                return (data.height * 100 - data.expectations.priority.norm + satisfactionTriangleSize * 2)  / 100 + 'in';
            }
        })
        .text('SAT')
        .style('font-size', '10')
        .style('fill', colorRed);

    //render energy drain trail
    svg.append('g').append('polygon')
        .attr('points', function () {

            var x1 = ((laneStep * 6 - 0.06) * 100),
                y1 = data.height * 100 - data.expectations.priority.kinetic,

                y2 = data.height * 100 - (data.expectations.kinetic.base + 15),
                x2 = (laneStep * 6 + laneStep / 4) * 100,

                x3 = (laneStep * 7 - 0.09) * 100,
                y3 = data.height * 100 - data.expectations.priority.kinetic;

            return x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + x3 + ',' + y3;
        })
        .style('fill', colorRed);

    //render kinetic diamond
    svg.append("g").append("path")
        .attr("d", d3.svg.symbol()
            .size(function () {
                return 22 * 22;
            })
            .type(function () {
                return "diamond";
            }))
        .attr("transform", "translate(" + (laneStep * 6 + .07) * 100 +
            ", " + (data.height * 100 - data.expectations.priority.kinetic) + ")")
        .style('fill', '#fff')
        .style('stroke', colorRed)
        .style('stroke-width', '0.02in');

    //render diamond text
    svg.append('g').append('text')
        .attr('x', (laneStep * 6 + 0.1) + 'in')
        .attr('y', (data.height * 100 - data.expectations.priority.kinetic + 17) / 100 + 'in')
        .text('k')
        .style('fill', colorRed);

    //render sigma ticks
    //grabs data.results as it needs to run possibly 15 times or more
    svg.append('g').selectAll('sigmaTicksUp').data(thirtyItemArray).enter().append('line')
        .attr('class', 'sigmaTicks')
        .attr('x1', '0in')
        .attr('y1', function (d, i) {
            var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
            if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height) {
                return tickToRender + 'in';
            }
            return -30;
        })
        .attr('x2', '.1in')
        .attr('y2', function (d, i) {
            var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
            if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height)
                return tickToRender + 'in';
        })
        .style('stroke', '#999')
        .style('stroke-width', function (d, i) {
            return i % 2 == 0 ? '0in' : '0.01in'
        });

    // render line below headers
    svg.append('line')
        .attr('x1', '0in')
        .attr('y1', data.headerHeight + 'in')
        .attr('x2', data.width + 'in')
        .attr('y2', data.headerHeight + 'in')
        .style('stroke', '#000')
        .style('stroke-width', '0.01in');

    // render titles
    svg.append('g').selectAll('words').data(titleArray).enter()
        .append('text')
        .attr('class', 'titles')
        .attr('x', data.headerHeight - 0.1 + 'in')
        .attr('y', function (d, i) {
            return (laneStep * i) + 0.05 + 'in';
        })
        .style('fill', '#000')
        .attr('transform', 'rotate(-90, 0, 0), translate(-272, 13)')
        .text(function (d) {
            return d;
        });

    // render chart border
    svg.append('rect')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .attr('x', '0.0125in')
        .attr('y', '0.0125in')
        .attr('rx', '0.25in')
        .attr('ry', '0.25in')
        .style('fill', 'transparent')
        .style('stroke', colorRed)
        .style('stroke-width', '0.025in');
}

renderBasicChart(data);
renderPredictorChart(data);
renderPriorityChart(data);

