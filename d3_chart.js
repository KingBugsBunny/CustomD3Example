var data = {
        width: 2,
        height: 8.5,
        headerHeight: 1.5,
        plots: [
            {
                title: 'Dominance',
                midpoint: 408,
                items: [
                    {
                        dataPoint: 223,
                        dataLayers: [
                            'B',
                            'S',
                            'L',
                            'SC'
                        ]
                    }
                ],
                edgeColor: '#999'
            },
            {
                title: 'Extroversion',
                midpoint: 408,
                items: [
                    {
                        dataPoint: 287,
                        dataLayers: [
                            'B',
                            'S',
                            'L',
                            'SC'
                        ]
                    }
                ],
                edgeColor: '#999'
            },
            {
                title: 'Peace / Patience',
                midpoint: 408,
                items: [
                    {
                        dataPoint: 575,
                        dataLayers: [
                            'B',
                            'S',
                            'L',
                            'SC'
                        ]
                    }
                ],
                edgeColor: '#999'
            },
            {
                title: 'Conformity',
                midpoint: 408,
                items: [
                    {
                        dataPoint: 548,
                        dataLayers: [
                            'B',
                            'S',
                            'L',
                            'SC'
                        ]
                    }
                ],
                edgeColor: '#000'
            },
            {
                title: 'Logic',
                midpoint: 421,
                items: [
                    {
                        dataPoint: 336,
                        dataLayers: [
                            'B',
                            'S',
                            'OC'
                        ],
                        dataLabel: 'FEL',
                    }
                ],
                edgeColor: '#000'
            },
            {
                title: 'Energy Style',
                items: [
                    {
                        dataPoint: 562,
                        dataLayers: ['OC'],
                        dataLabel: 'A'
                    },
                    {
                        dataPoint: 398,
                        dataLayers: ['OC'],
                        dataLabel: 'S'
                    },
                    {
                        dataPoint: 275,
                        dataLayers: ['OC'],
                        dataLabel: 'T'
                    }
                ],
                edgeColor: '#999'
            },
            {
                title: 'Kinetic Energy',
                items: [
                    {
                        dataPoint: 524,
                        dataLayers: ['D'],
                        dataLabel: 'K'
                    }
                ],
                edgeColor: 'transparent'
            }
        ]
    };

    var colorBlue1 = '#0f4f6b',
        colorBlue2 = '#b7cde2';

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
    laneStep = data.width / data.plots.length;
    for (var i = 0; i < data.plots.length; i++) {
        svg.append('line')
                .attr('x1', (laneStep * (i + 1.0)) + 'in')
                .attr('y1', '0.025in')
                .attr('x2', (laneStep * (i + 1.0)) + 'in')
                .attr('y2', data.height + 'in')
                .attr('stroke', data.plots[i].edgeColor)
                .attr('stroke-width', '0.01in');
    }

    // Render line below headers
    svg.append('line')
            .attr('x1', '0in')
            .attr('y1', '1.5in')
            .attr('x2', data.width + 'in')
            .attr('y2', '1.5in')
            .attr('stroke', '#000')
            .attr('stroke-width', '0.01in');

    // Render plots
    for (var p = 0; p < data.plots.length; p++) {
        var plot = data.plots[p];

        for (var i=0; i< plot.items.length; i++) {
            var item = plot.items[i];

            if (item.dataLayers) {
                for (var l = 0; l < item.dataLayers.length; l++) {
                    var layer = item.dataLayers[l];

                    switch (layer) {
                        case 'B':
                        {
                            var y = plot.midpoint > item.dataPoint ? (data.height - plot.midpoint / 100) : data.height - item.dataPoint / 100;
                            var h = plot.midpoint > item.dataPoint ? plot.midpoint / 100 - item.dataPoint / 100 : item.dataPoint / 100 - plot.midpoint / 100;
                            svg.append('rect')
                                .attr('x', ((laneStep * p) + 0.01) + 'in')
                                .attr('y', y + 'in')
                                .attr('width', (laneStep - 0.01) + 'in')
                                .attr('height', h + 'in')
                                .attr('fill', colorBlue2);
                            break;
                        }
                        case 'L':
                        {
                            break;
                        }
                        case 'S':
                        {
                            svg.append('line')
                                .attr('x1', laneStep * p + 'in')
                                .attr('x2', (laneStep * (p + 1.0)) + 'in')
                                .attr('y1', (data.height - plot.midpoint / 100) + 'in')
                                .attr('y2', (data.height - plot.midpoint / 100) + 'in')
                                .attr('stroke', colorBlue1)
                                .attr('stroke-width', '0.025in');
                            break;
                        }
                        case 'SC':
                        {
                            svg.append('circle')
                                .attr('cx', (laneStep * (p + 1.0) - laneStep / 2.0) + 'in')
                                .attr('cy', data.height - (item.dataPoint / 100) + 'in')
                                .attr('r', (laneStep / 2 - 0.025) + 'in')
                                .attr('fill', colorBlue1)
                                .attr('stroke', colorBlue1)
                                .attr('stroke-width', '0.025in');
                            break;
                        }
                        case 'OC':
                        {
                            svg.append('circle')
                                .attr('cx', (laneStep * (p + 1.0) - laneStep / 2.0) + 'in')
                                .attr('cy', data.height - (item.dataPoint / 100) + 'in')
                                .attr('r', (laneStep / 2 - 0.025) + 'in')
                                .attr('fill', 'white')
                                .attr('stroke', colorBlue1)
                                .attr('stroke-width', '0.025in');
                            break;
                        }
                        case 'D':
                        {
                            var sw = Math.sqrt(Math.pow(laneStep, 2)/2);
                            svg.append('rect')
                                .attr('x', ((laneStep * p) + laneStep/2 - sw/2) + 'in')
                                .attr('y', data.height - (item.dataPoint / 100) - sw/2 + 'in')
                                .attr('width', sw + 'in')
                                .attr('height', sw + 'in')
                                .attr('fill', 'white')
                                .attr('stroke', colorBlue1)
                                .attr('stroke-width', '0.025in');
                            break;
                        }
                    }
                }
            }

            if (item.dataLabel) {
                svg.append('text')
                        .attr('x', (laneStep * (p + 1.0) - laneStep / 2.0) + 'in')
                        .attr('y', data.height - (item.dataPoint / 100) + 'in')
                        .attr('fill', colorBlue1)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'central')
                        .style('font-family', 'Arial')
                        .style('font-size', '7pt')
                        .style('font-weight', 'bold')
                        .text(item.dataLabel)
            }
        }


    }

    svg.selectAll('words').data(data.plots).enter().
        append('text')
            .attr('x', function(){ return data.headerHeight - 0.05 + 'in'})
            .attr('y', function(d,i){ return (laneStep * i)  + 0.1 + 'in'})
            .attr('fill',function(){return '#000'})
            .attr('text-anchor', function(){return'middle'})
            .attr('transform', function(){return ''})
            .attr('transform', function(){return 'rotate(-90, 0, 0), translate(-230, 10)'})
            .text(function(d, i){ return data.plots[i].title});

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