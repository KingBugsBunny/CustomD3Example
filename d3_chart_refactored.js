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

// color initialisation
var colorBlue1 = '#0f4f6b',
    colorBlue2 = '#b7cde2';

//title array
var basicTitles = [
    'Dominance',
    'Extroversion',
    'Pace/Patience',
    'Conformity',
    'Logic',
    'Energy Style',
    'Kinetic Energy'
]

// canvas
var svg = d3.select('body')
    .append('svg')
    .attr('width', data.width + 0.05 + 'in')
    .attr('height', data.height + 0.05 + 'in');

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
    .attr('fill', 'white');

// Background surface
svg.append('rect')
    .attr('width', data.width + 'in')
    .attr('height', data.height + 'in')
    .attr('x', '0.0125in')
    .attr('y', '0.0125in')
    .attr('rx', '0.25in')
    .attr('ry', '0.25in')
    .attr('fill', 'white');

// Render lanes
laneStep = data.width / basicTitles.length;

svg.selectAll('laneLines').data(basicTitles).enter().append('line')
    .attr('x1', function(d,i){return laneStep * (i + 1.0) + 'in'})
    .attr('y1', '0.025in')
    .attr('x2', function(d,i){return laneStep * (i + 1.0) + 'in'})
    .attr('y2', data.height + 'in')
    .attr('stroke','#000')
    .attr('stroke-width', '0.01in');

// Render line below headers
svg.append('line')
    .attr('x1', '0in')
    .attr('y1', '1.5in')
    .attr('x2', data.width + 'in')
    .attr('y2', '1.5in')
    .attr('stroke', '#000')
    .attr('stroke-width', '0.01in');

// TODO: create logic
//logic


// titles
svg.append('g').selectAll('words').data(basicTitles).enter()
    .append('text')
    .attr('x', function () {
        return data.headerHeight - 0.1 + 'in'
    })
    .attr('y', function (d, i) {
        return (laneStep * i) + 0.05 + 'in'
    })
    .attr('fill', function () {
        return '#000'
    })
    .attr('text-anchor', function () {
        return 'middle'
    })
    .attr('transform', function () {
        return 'rotate(-90, 0, 0), translate(-225, 13)'
    })
    .text(function (d) {
        return d
    });

// Chart border
svg.append('rect')
    .attr('width', data.width + 'in')
    .attr('height', data.height + 'in')
    .attr('x', '0.0125in')
    .attr('y', '0.0125in')
    .attr('rx', '0.25in')
    .attr('ry', '0.25in')
    .attr('fill', 'transparent')
    .attr('stroke', colorBlue1)
    .attr('stroke-width', '0.025in');