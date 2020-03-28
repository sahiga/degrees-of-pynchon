function drawNewArcs(data, g, centerColor) {
    const nodes = data.nodes;
    const links = data.links;

    if (nodes.length > 0) {
        const xScale = d3.scale.linear()
            .domain([0, nodes.length])
            .range([0, HEIGHT]);

        const centerPos = WIDTH / 2;

        // Draw nodes
        nodes.forEach(function (d, i) {
            if (d.group === 0) {
                d.x = centerPos;
                d.cx = centerPos;
            } else if (d.group === 1) {
                d.x = -Math.round(xScale(i)) + (centerPos);
                d.cx = d.x + (i * 8);
            } else if (d.group === 2) {
                d.x = Math.round(xScale(i)) + (centerPos);
                d.cx = d.x + (i * 8);
            }
            d.y = 300;
        });

        g.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('fill', function (d, i) {
                if (d.group === 0) {
                    return centerColor;
                } else {
                    return colors(i);
                }
            })
            .attr('cx', function (d) { return d.cx; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', 4);

        g.selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .text(function (d) {
                if (d.group !== 0) {
                    return d.nodeName;
                }
            })
            .attr('class', 'writer')
            .attr('style', function (d, i) {
                return "fill: " + colors(i) + ";";
            })
            .attr('x', function (d) { return d.cx; })
            .attr('y', function (d) {
                if (d.group === 1) {
                    return d.y + 20;
                } else {
                    return d.y - 20;
                }
            })
            .attr('transform', function (d) {
                if (d.group === 1) {
                    return 'rotate(90 ' + (d.cx) + ',' + (d.y + 20) + ')'
                } else {
                    return 'rotate(-90 ' + (d.cx) + ',' + (d.y - 20) + ')'
                }
            });

        // Draw arcs
        links.forEach(function (d) {
            d.x = (nodes[d.source].x - nodes[d.target].x) * 1.2,
                d.y = nodes[d.source].y - nodes[d.target].y,
                d.r = Math.sqrt(d.x * d.x + d.y * d.y)
        });

        g.selectAll('path')
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

        g.on('mouseleave', function () {
            g.remove();
            graphState.setHasMultiple(false);
        });
    }
}
