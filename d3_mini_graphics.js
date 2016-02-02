'use strict';


var data = {
    height: 4,
    width: 6,
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

function miniChart(data) {

    // color initialisation
    var colorBlue1 = '#0f4f6b',
        colorBlue2 = '#b7cde2';

    //array initialisation
    var circleArray = [];

    var originHeight = data.height / 2,
        originWidth = data.width / 2;

    //create scale
    var heightScale = d3.scale.linear()
        .domain([0, Math.max(circleArray)])
        .range([0, data.height * 100]);

    //parse data
    for (var k in data.expectations.basic) {
        if (data.expectations.basic.hasOwnProperty(k)) {
            circleArray.push(data.expectations.basic[k]);
        }
    }

    circleArray.splice(4, 1);
    circleArray.splice(5, 9);

    var laneStep = originWidth / (circleArray.length + 1);

    //create canvas
    var svg = d3.select('.miniChart')
        .classed('svg-container', true)
        .append('svg')
        .attr('viewBox', '0 0 ' + (data.width + 0.05) * 100 + ' ' + (data.height + 0.05) * 100 + '')
        .classed('svg-content-responsive', true);

    //create background
    svg.append('g').append('rect')
        .attr('x', '0in')
        .attr('y', '0in')
        .attr('width', data.width + 'in')
        .attr('height', data.height + 'in')
        .style('fill', '#fff')
        .style('stroke', colorBlue1);

    //append name
    svg.append('g').append('text')
        .attr('x', '3in')
        .attr('y', 1 + 'in')
        .text(data.name)
        .style('font-size', '1.5em')
        .style('font-weight', '700');

    //render norm line
    svg.append('g').append('line')
        .attr('class', 'normLine')
        .attr('x1', laneStep + 'in')
        .attr('y1', originHeight + 'in')
        .attr('x2', ((laneStep * (circleArray.length - 1)) + 'in'))
        .attr('y2', originHeight + 'in')
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.04in');

    //render logic line
    svg.append('g').append('line')
        .attr('class', 'normLine')
        .attr('x1', ((laneStep * (circleArray.length)) + 'in'))
        .attr('y1', function() {
            var y;

            y = (originHeight * 100 - (data.expectations.basic.norm - data.expectations.basic.logic)) / 100;

            return y + 'in';
        })
        .attr('x2', ((laneStep * (circleArray.length - 1)) + 'in'))
        .attr('y2', function() {
            var y;

            y = (originHeight * 100 - (data.expectations.basic.norm - data.expectations.basic.logic)) / 100;

            return y + 'in';
        })
        .style('stroke', colorBlue1)
        .style('stroke-width', '0.04in');

    //render DEPC circles
    svg.append('g').selectAll('circles').data(circleArray).enter().append('circle')
        .attr('cx', function(d, i) {
            return (laneStep * (i + 1.0) - laneStep / 2.0) + 'in'
        })
        .attr('cy', function(d) {
            var y;

            y = heightScale((originHeight * 100 - (data.expectations.basic.norm - d)) / 100);

            return y + 'in';
        })
        .attr('r', (laneStep / 2) - 0.005 + 'in')
        .style('fill', colorBlue1);
};

miniChart(data);
