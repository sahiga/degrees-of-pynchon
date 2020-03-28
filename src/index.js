(function () {
    // Get data and SVG element
    const data = WRITERS['Thomas Pynchon'];
    const nodes = data.nodes;
    const links = data.links;
    const svg = graphState.getSVGElement();
    const pynchonGraph = svg.append('g').attr('width', WIDTH);
    const xScale = d3.scale.linear()
        .domain([0, nodes.length])
        .range([0, HEIGHT]);

    let centerNode;

    // Draw nodes
    nodes.forEach(function (d, i) {
        d.x = Math.round(xScale(i)) + 50;
        d.y = 300;
        d.cx = d.x + (i * 8);
        d.color = colors(i);
        if (d.group === 0) {
            centerNode = d;
        }
    });

    pynchonGraph.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('fill', function (d, i) {
            return d.color;
        })
        .attr('id', function (d, i) { return d.nodeName; })
        .attr('cx', function (d, i) { return d.cx; })
        .attr('cy', function (d, i) { return d.y; })
        .attr('r', 4);

    pynchonGraph.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .text(function (d, i) {
            return d.nodeName;
        })
        .attr('style', function (d, i) {
            return 'fill: ' + d.color;
        })
        .attr('x', function (d) { return d.cx; })
        .attr('y', function (d) {
            if (d.group === 0) {
                return 100;
            } else if (d.group === 1) {
                return d.y + 20;
            } else if (d.group === 2) {
                return d.y - 20;
            }
        })
        .attr('transform', function (d) {
            if (d.group === 0) {
                return 'translate(' + (WIDTH / 2 - d.cx - 20) + ', 0)';
            } else if (d.group === 1) {
                return 'rotate(90 ' + (d.cx) + ',' + (d.y + 20) + ')'
            } else if (d.group === 2) {
                return 'rotate(-90 ' + (d.cx) + ',' + (d.y - 20) + ')'
            }
        })
        .attr('class', function (d) {
            if (d.group === 0) {
                return 'highlight writer';
            } else {
                return 'writer';
            }
        })
        .on('mouseenter', function (d, i) {
            if (!graphState.getHasMultiple()) {
                const current = this;
                const currentIndex = i;

                if (currentIndex !== PYNCHON_INDEX) {
                    pynchonGraph.selectAll('text').transition().delay(0).duration(FADE_MS).style('opacity', function () {
                        return (this === current) ? 1 : LOW_OPACITY;
                    });

                    pynchonGraph.selectAll('path').transition().delay(0).duration(FADE_MS).style('opacity', function (d, i) {
                        if (i < PYNCHON_INDEX) {
                            return (i === currentIndex) ? 1 : LOW_OPACITY;
                        } else {
                            return (i === currentIndex - 1) ? 1 : LOW_OPACITY;
                        }
                    });

                    pynchonGraph.selectAll('circle').transition().delay(0).duration(FADE_MS).style('opacity', function (d, i) {
                        return (i === currentIndex) ? 1 : LOW_OPACITY;
                    });

                    pynchonGraph.select('line').transition().delay(0).duration(FADE_MS).style('opacity', LOW_OPACITY);
                }
            }
        })
        .on('mouseleave', function () {
            if (!graphState.getHasMultiple()) {
                pynchonGraph.selectAll('text').transition().delay(0).duration(FADE_MS).style('opacity', 1);
                pynchonGraph.selectAll('path').transition().delay(0).duration(FADE_MS).style('opacity', 1);
                pynchonGraph.selectAll('circle').transition().delay(0).duration(FADE_MS).style('opacity', 1);
                pynchonGraph.select('line').transition().delay(0).duration(FADE_MS).style('opacity', 1);
            }
        })
        .on('click', function (d) {
            pynchonGraph.selectAll('text').transition().style('opacity', LOW_OPACITY);
            pynchonGraph.selectAll('circle').transition().style('opacity', LOW_OPACITY);
            pynchonGraph.selectAll('path').transition().style('opacity', LOW_OPACITY);
            drawNewCanvas(d);
        });

    pynchonGraph.selectAll('line')
        .data([centerNode])
        .enter()
        .append('line')
        .attr('style', function (d, i) {
            return 'stroke: ' + d.color;
        })
        .attr('x1', function (d) {
            return d.cx;
        })
        .attr('y1', function (d) {
            return 110;
        })
        .attr('x2', function (d) {
            return d.cx;
        })
        .attr('y2', function (d) {
            return d.y - 10;
        });

    // Draw arcs
    links.forEach(function (d, i) {
        d.x = (nodes[d.source].x - nodes[d.target].x) * 1.1,
            d.y = nodes[d.source].y - nodes[d.target].y,
            d.r = Math.sqrt(d.x * d.x + d.y * d.y)
    });

    pynchonGraph.selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .style('fill', 'transparent')
        .style('stroke', function (d, i) {
            return colors(i);
        })
        .attr('d', function (d) {
            return 'M ' + nodes[d.source].cx + ', ' + 100 + ' A ' + d.r + ' ' + d.r + ' 0 0 1' + nodes[d.target].cx + ', ' + 100;
        })
        .attr('transform', 'translate(0, 200)');
})();
