'use strict';

var data = {
    width: 2,
    height: 8.5,
    headerHeight: 1.5,
    name: 'C. C. Sample',
    //type: pgc.SurveyType.ProScan,
    responses: [
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

function renderChart(whichChart, data) {

    var data = data,
        chart = whichChart;

    // color initialisation
    var colorBlue1 = '#0f4f6b',
        colorBlue2 = '#b7cde2',
        colorGreen2 = '#8DC63F',
        colorGreen1 = '#006838',
        colorRed = '#BE1E2D',
        color1,
        color2;

    if (chart == 'basic') {
        color1 = colorBlue1,
            color2 = colorBlue2;
    } else if (chart == 'predictor') {
        color1 = colorGreen1,
            color2 = colorGreen2
    } else if (chart == 'priority') {
        color1 = colorRed,
            color2 = colorRed;
    }

    var titleArray = [
        'Dominance',
        'Extroversion',
        'Pace/Patience',
        'Conformity',
        'Logic'
    ];

    //Init title Arrays
    //title array
    if (chart == 'basic' || chart == 'predictor') {
        titleArray.push('Energy Style', 'Kinetic Energy');
    } else {

        titleArray.push('Satisfaction', 'Energy Drain');
    }

//define step variables
    var laneStep = data.width / titleArray.length;

//create scales
    var norm = (data.height * 100) - data.expectations[chart].norm,
        sigmaTickOriginPoint = norm;

    while (sigmaTickOriginPoint > data.headerHeight) {
        sigmaTickOriginPoint -= 100;

    }
    sigmaTickOriginPoint += 100;
    sigmaTickOriginPoint = norm - data.headerHeight - (norm - sigmaTickOriginPoint);


    var satisfactionTriangleSize = 15,
        depcTriangleSize = 12;

// canvas
    var svg = d3.select('.chart')
        .classed('svg-container', true)
        .append('svg')
        .attr('viewBox', '0 0 ' + (data.width + 0.05) * 100 + ' ' + (data.height + 0.05) * 100 + '')
        .classed('svg-content-responsive', true);

//data parsing
    var depcArray = [],
        tasArray = [],
        arrowOriginArray = [],
        arrowLineLength = [],
        depcKeyArray = [],
        thirtyItemArray = data.responses.slice();

    thirtyItemArray = thirtyItemArray.slice(0, 29);

    //assign data from data.expectations[chart] so it can be assigned to other arrays
    for (var k in data.expectations[chart]) {
        if (data.expectations[chart].hasOwnProperty(k)) {
            depcArray.push(data.expectations[chart][k]);
        }
    }
    tasArray = depcArray.splice(4, 7);
    tasArray.splice(0, 2);
    tasArray.splice(3, 2);


    for (var k in data.expectations) {
        if (data.expectations.hasOwnProperty(k)) {
            arrowOriginArray.push(data.expectations[k].base);
            arrowLineLength.push(data.expectations[k].length);
            depcKeyArray.push(k);
        }
    }

    arrowLineLength = arrowLineLength.splice(3, 9);
    arrowOriginArray = arrowOriginArray.splice(3, 9);

    depcKeyArray = depcKeyArray.splice(3, 4);


    function renderBackgroundScaffolding() {
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
            .style('fill', 'transparent');

// Background surface
        svg.append('rect')
            .attr('width', data.width + 'in')
            .attr('height', data.height + 'in')
            .attr('x', '0.0125in')
            .attr('y', '0.0125in')
            .attr('rx', '0.25in')
            .attr('ry', '0.25in')
            .style('fill', '#fff');

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
                return i + 2.05 + 'in'
            })
            .style('fill', '#999')
            .text(function (d, i) {
                return (i - 7) * -1;
            });
    }

    function renderBars() {
        //main chart logic

        //render DEPC bars
        svg.append('g').selectAll('depcBars').data(depcArray).enter().append('rect')
            .attr('class', 'depcBars')
            .attr('x', function (d, i) {
                return (laneStep * i) + 0.005 + 'in'
            })
            .attr('y', function (d) {
                if (d > data.expectations.basic.norm) {
                    //if positive
                    return (data.height * 100 - d ) / 100 + 'in';
                } else {
                    //if negative
                    return norm / 100 + 'in';
                }
            })
            .attr('width', (laneStep) + 'in')
            .attr('height', function (d) {
                if (d - data.expectations[chart].norm < 0) {
                    return (d - data.expectations[chart].norm) * -1 / 100 + 'in';
                } else if ((d - data.expectations[chart].norm) / 100 < 0) {
                    return ((d - data.expectations[chart].norm) / 100) * -1 + 'in';
                } else {
                    return (d - data.expectations[chart].norm) / 100 + 'in'
                }
            })
            .style('fill', color2);

        //render Logic Bar
        //if positive
        if ((data.expectations[chart].ref - data.expectations[chart].logic) < 0) {
            svg.append('g').append('rect')
                .attr('class', 'logicBar')
                .attr('x', (laneStep * 5 - laneStep + 0.01) + 'in')
                .attr('y', (data.height * 100 - (data.expectations[chart].logic / 100) + 'in'))
                .attr('height', function () {
                    var heightOfBar = data.expectations[chart].ref - data.expectations[chart].logic;

                    if (heightOfBar < 0) {
                        heightOfBar *= -1;
                    }
                    return heightOfBar / 100 + 'in';
                })
                .attr('width', (laneStep) + 'in')
                .style('fill', color2);
        } else {
            //if negative
            svg.append('g').append('rect')
                .attr('class', 'logicBar')
                .attr('x', (laneStep * 5 - laneStep) + 'in')
                .attr('y', ((data.height * 100) - data.expectations[chart].ref) / 100 + 'in')
                .attr('height', function () {
                    var heightOfBar = data.expectations[chart].ref - data.expectations[chart].logic;

                    if (heightOfBar < 0) {
                        heightOfBar *= -1;
                    }
                    return heightOfBar / 100 + 'in'
                })
                .attr('width', (laneStep) + 'in')
                .style('fill', color2);
        }
    }

    function renderLanes() {
        // Render lanes
        svg.append('g').selectAll('laneLines').data(titleArray).enter().append('line')
            .attr('x1', function (d, i) {
                return laneStep * (i + 1.0) + 'in';
            })
            .attr('y1', '0.0125in')
            .attr('x2', function (d, i) {
                return laneStep * (i + 1.0) + 'in';
            })
            .attr('y2', data.height + 0.0125 + 'in')
            .style('stroke', function (d, i) {
                return i == titleArray.length - 1 ? 'transparent' : i === 3 || i === 4 ? '#000' : '#999'
            })
            .style('stroke-width', function () {
                return '0.01in';
            });
    }

    function renderDEPCCircles() {

        //render DEPC circles
        svg.append('g').selectAll('circles').data(depcArray).enter().append('circle')
            .attr('cx', function (d, i) {
                return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in'
            })
            .attr('cy', function (d) {
                return data.height - (d / 100) + 'in'
            })
            .attr('r', (laneStep / 2 ) - 0.005 + 'in')
            .style('fill', color1);
    }

    function rednderDEPCLines() {
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
                if (i < 3) {
                    if (depcArray[i + 1]) {
                        return (data.height * 100 - depcArray[i + 1]) / 100 + 'in'
                    }
                }
            })
            .style('stroke', function (d, i) {
                if (i < 3) {
                    return color1
                }
            })
            .style('stroke-width', '0.025in');
    }

    function renderLogicCircle() {
        //render Logic circle
        svg.append('g').append('circle')
            .attr('cx', laneStep * (5) - laneStep / 2.0 + 'in')
            .attr('cy', data.height - (data.expectations[chart].logic / 100) + 'in')
            .attr('r', (laneStep / 2 - 0.01) + 'in')
            .style('fill', function () {
                return chart == 'priority' ? color1 : '#fff'
            })
            .style('stroke', color1)
            .style('stroke-width', '0.0125in');
    }

    function renderLogicText() {

        //render logic text
        svg.append('g').append('text')
            .attr('x', (laneStep * (4 + 1.0) - laneStep / 2.0) + 'in')
            .attr('y', data.height - (data.expectations[chart].logic / 100) + .03 + 'in')
            .style('fill', color1)
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .text(function () {
                if (data.expectations[chart].ref > data.expectations[chart].logic) {
                    return 'FEL'
                } else {
                    return 'BAL'
                }
            });

    }

    function renderTAS() {

        //render TAS circles
        svg.append('g').selectAll('circles').data(tasArray).enter().append('circle')
            .attr('cx', (laneStep * (5 + 1.0) - laneStep / 2.0) + 'in')
            .attr('cy', function (d) {
                return data.height - (d / 100) + 'in'
            })
            .attr('r', (laneStep / 2 - 0.010) + 'in')
            .style('fill', '#fff')
            .style('stroke', color1)
            .style('stroke-width', '0.0125in');

        //render TAS text
        svg.append('g').selectAll('text').data(tasArray).enter().append('text')
            .attr('x', (laneStep * 6 - laneStep / 2.0) + 'in')
            .attr('y', function (d) {
                return data.height - (d / 100) + .06 + 'in'
            })
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
            .attr('fill', color1);
    }

    function renderNormAndLogicLine() {
        //render norm line
        svg.append('g').append('line')
            .attr('class', 'normLine')
            .attr('x1', '0.0125in')
            .attr('y1', norm / 100 + 'in')
            .attr('x2', ((laneStep * 4) - .004 + 'in'))
            .attr('y2', norm / 100 + 'in')
            .style('stroke', color1)
            .style('stroke-width', '0.03in');

        //render logic line
        svg.append('g')
            .append('line')
            .attr('class', 'normLine')
            .attr('x1', (laneStep * 5) + 'in')
            .attr('y1', ((data.height * 100) - data.expectations[chart].ref) / 100 + 'in')
            .attr('x2', (laneStep * 4) + 'in')
            .attr('y2', ((data.height * 100) - data.expectations[chart].ref) / 100 + 'in')
            .style('stroke', color1)
            .style('stroke-width', '0.03in');
    }

    function renderSatisfactionAndEnergyTrail() {
        //priority
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
            .style('fill', color1);

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
                    return (data.height * 100 - data.expectations.priority.norm + satisfactionTriangleSize * 1.3) / 100 + 'in';
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
            .style('fill', color1);

        //render satisfaction text (SAT)
        svg.append('g').append('text')
            .attr('x', (laneStep * 5 + laneStep / 100000) * 100)
            .attr('y', function () {
                if (data.expectations.satisfaction.level == 'H') {
                    return (data.height * 100 - data.expectations.priority.norm - satisfactionTriangleSize) / 100 + 'in';
                } else {
                    return (data.height * 100 - data.expectations.priority.norm + satisfactionTriangleSize * 2) / 100 + 'in';
                }
            })
            .text('SAT')
            .style('font-size', '10')
            .style('fill', color1);

        //render energy drain trail
        svg.append('g').append('polygon')
            .attr('points', function () {

                var x1 = ((laneStep * 6 - 0.069) * 100),
                    y1 = data.height * 100 - data.expectations.priority.kinetic,

                    y2 = data.height * 100 - (data.expectations.kinetic.base + 15),
                    x2 = (laneStep * 6 + laneStep / 4) * 100,

                    x3 = (laneStep * 7 - 0.077) * 100,
                    y3 = data.height * 100 - data.expectations.priority.kinetic;

                return x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + x3 + ',' + y3;
            })
            .style('fill', colorRed);
    }

    function renderKineticDiamond() {
        //render kinetic diamond
        svg.append("g").append("path")
            .attr("d", d3.svg.symbol()
                .size(function () {
                    return 24.5 * 24.5;
                })
                .type(function () {
                    return "diamond";
                }))
            .attr("transform", function () {
                return "translate(" + (laneStep * 6 + .07) * 100 +
                    ", " + (data.height * 100 - data.expectations.priority.kinetic) + ")"
            })
            .style('fill', '#fff')
            .style('stroke', color1)
            .style('stroke-width', '0.01in');

        //render diamond text
        svg.append('g').append('text')
            .attr('x', (laneStep * 6 + 0.1) + 'in')
            .attr('y', (data.height * 100 - data.expectations.priority.kinetic + 17) / 100 + 'in')
            .text('K')
            .style('fill', color1);
    }

    function renderArrowLines() {

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
            .style('stroke-width', function (d, i) {
                var lineWidth,
                    k = depcKeyArray[i];

                if (data.expectations[k]) {
                    if (data.expectations[k].base < (depcArray[i] - laneStep * 100 / 2) ||
                        data.expectations[k].base > (depcArray[i] + laneStep * 100 / 2)) {
                        lineWidth = '0.02in';
                    } else {
                        lineWidth = '0.0in';
                    }
                } else {
                    lineWidth = '0.0in';
                }

                return lineWidth;
            });

        if (data.expectations.logic.base < (data.expectations.priority.logic - laneStep * 100) ||
            data.expectations.logic.base > (data.expectations.priority.logic + laneStep * 100)) {
            // render logic arrow line

            svg.append('g')
                .append('line')
                .attr('class', 'logArrowLine')
                .attr('x1', laneStep * 4 + laneStep / 2.0 + 'in')
                .attr('y1', function () {
                    if (data.expectations.logic.base > data.expectations.priority.logic) {
                        return (data.height * 100 - data.expectations.logic.base) / 100 + 'in';
                    }
                    else {
                        return (data.height * 100 - data.expectations.priority.logic + 20) / 100 + 'in';
                    }

                })
                .attr('x2', laneStep * 4 + laneStep / 2.0 + 'in')
                .attr('y2', function () {
                    if (data.expectations.logic.base < data.expectations.priority.logic) {
                        return (data.height * 100 - data.expectations.logic.base) / 100 + 'in';
                    } else {
                        return (data.height * 100 - data.expectations.priority.logic - 20) / 100 + 'in';
                    }

                })
                .style('stroke', colorRed)
                .style('stroke-width', '0.02in');
        }
    }

    function renderArrowOriginPoints() {
        //render arrow origin points
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
            .style('fill', colorBlue1);
    }

    function renderArrowHeads() {

        //render logic arrow head
        svg.append('g').append('path')
            .attr("d", d3.svg.symbol()
                .size(function () {
                    return depcTriangleSize * depcTriangleSize;
                })
                .type(function () {
                    if (data.expectations.logic.base < data.expectations.priority.logic) {
                        return 'triangle-up';
                    } else {
                        return 'triangle-down';
                    }
                }))
            .attr("transform", function () {
                if (data.expectations.logic.base < data.expectations.priority.logic) {
                    return "translate(" + (laneStep * 4 + laneStep / 3.2) * 100 +
                        ", " + (data.height * 100 - data.expectations.priority.logic + 7) + ")"
                } else {
                    return "translate(" + ((laneStep * 4 + laneStep / 3.2)) * 100 +
                        ", " + (data.height * 100 - data.expectations.priority.logic - 28) + ")"
                }
            })
            .style('fill', colorRed);


        if (data.expectations.dominance.base < (data.expectations.priority.dominance - laneStep * 100) ||
            data.expectations.dominance.base > (data.expectations.priority.dominance + laneStep * 100)) {
            //render dominance arrow head
            svg.append('path')
                .attr("d", d3.svg.symbol()
                    .size(function () {
                        return depcTriangleSize * depcTriangleSize;
                    })
                    .type(function () {
                        if (data.expectations.dominance.base < data.expectations.priority.dominance) {
                            return 'triangle-up';
                        } else {
                            return 'triangle-down';
                        }
                    }))
                .attr("transform", function () {
                    if (data.expectations.dominance.base < data.expectations.priority.dominance) {
                        return "translate(" + (laneStep / 2.05) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.dominance) + ")"
                    } else {
                        return "translate(" + ((laneStep / 2.05)) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.dominance - 28) + ")"
                    }
                })
                .style('fill', colorRed);
        }

        if (data.expectations.extroversion.base < (data.expectations.priority.extroversion - laneStep * 100) ||
            data.expectations.extroversion.base > (data.expectations.priority.extroversion + laneStep * 100)) {
            //render extroversion arrow head
            svg.append('path')
                .attr("d", d3.svg.symbol()
                    .size(function () {
                        return depcTriangleSize * depcTriangleSize;
                    })
                    .type(function () {
                        if (data.expectations.extroversion.base < data.expectations.priority.extroversion) {
                            return 'triangle-up';
                        } else {
                            return 'triangle-down';
                        }
                    }))
                .attr("transform", function () {
                    if (data.expectations.extroversion.base < data.expectations.priority.extroversion) {
                        return "translate(" + (laneStep + laneStep / 2.25) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.extroversion + 8) + ")"
                    } else {
                        return "translate(" + (laneStep + laneStep / 2.25) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.extroversion - 28) + ")"
                    }
                })
                .style('fill', colorRed);
        }

        if (data.expectations.pace.base < (data.expectations.priority.pace - laneStep * 100) ||
            data.expectations.pace.base > (data.expectations.priority.pace + laneStep * 100)) {
            //render pace arrow head
            svg.append('path')
                .attr("d", d3.svg.symbol()
                    .size(function () {
                        return depcTriangleSize * depcTriangleSize;
                    })
                    .type(function () {
                        if (data.expectations.pace.base < data.expectations.priority.pace) {
                            return 'triangle-up';
                        } else {
                            return 'triangle-down';
                        }
                    }))
                .attr("transform", function () {
                    if (data.expectations.pace.base < data.expectations.priority.pace) {
                        return "translate(" + ((laneStep * 2) + (laneStep / 2.5)) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.pace) + ")"
                    } else {
                        return "translate(" + ((laneStep * 2) + (laneStep / 2.5)) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.pace - 28) + ")"
                    }
                })
                .style('fill', colorRed);
        }

        if (data.expectations.conformity.base < data.expectations.priority.conformity - laneStep * 100 ||
            data.expectations.conformity.base > data.expectations.priority.conformity + laneStep * 100) {
            //render conformity arrow head
            svg.append('path')
                .attr("d", d3.svg.symbol()
                    .size(function () {
                        return depcTriangleSize * depcTriangleSize;
                    })
                    .type(function () {
                        if (data.expectations.conformity.base < data.expectations.priority.conformity) {
                            return 'triangle-up';
                        } else {
                            return 'triangle-down';
                        }
                    }))
                .attr("transform", function () {
                    if (data.expectations.conformity.base < data.expectations.priority.conformity) {
                        return "translate(" + ((laneStep * 3) + (laneStep / 2.7)) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.conformity) + ")"
                    } else {
                        return "translate(" + ((laneStep * 3) + (laneStep / 2.7)) * 100 +
                            ", " + (data.height * 100 - data.expectations.priority.conformity - 30) + ")"
                    }
                })
                .style('fill', colorRed);
        }
    }

    function renderForeGroundScaffolding() {

        //render sigma ticks
        //grabs data.results as it needs to run possibly 15 times or more
        svg.append('g').selectAll('sigmaTicksUp').data(thirtyItemArray).enter().append('line')
            .attr('class', 'sigmaTicks')
            .attr('x1', '0.0125in')
            .attr('y1', function (d, i) {
                var tickToRender = (i * 50 + sigmaTickOriginPoint) / 100;
                if ((i % 2) != 0 && tickToRender > data.headerHeight && tickToRender < data.height) {
                    return tickToRender + 'in';
                }
                return -30;
            })
            .attr('x2', laneStep / 5 + 'in')
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
            .attr('x1', '0.0125in')
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
            .attr('rx', '0.125in')
            .attr('ry', '0.125in')
            .style('fill', 'transparent')
            .style('stroke', color1)
            .style('stroke-width', '0.0125in');
    }

    //function calls
    //render Background
    renderBackgroundScaffolding();

    if (chart == 'basic' || chart == 'predictor') {

        renderBars();
        renderLogicCircle();
        renderLogicText();
        rednderDEPCLines();
        renderTAS();

    }
    else if (chart == 'priority') {
        renderArrowLines();
        renderArrowHeads();
        renderLogicCircle();
        renderArrowOriginPoints();
        renderSatisfactionAndEnergyTrail();

    }

    //render foreground
    renderForeGroundScaffolding();
    renderNormAndLogicLine();
    renderDEPCCircles();
    renderLanes();
    renderKineticDiamond();

}

renderChart('priority', data);
