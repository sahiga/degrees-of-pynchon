function drawNewCanvas(obj) {
    const data = WRITERS[obj.nodeName];
    const svg = graphState.getSVGElement();

    if (typeof data !== 'undefined') {
        graphState.setHasMultiple(true);
        const g = svg.append('g').attr('width', WIDTH);
        let centerColor;

        g.selectAll('circle')
            .data([obj])
            .enter()
            .append('circle')
            .attr('fill', function (d) {
                centerColor = d.color;
                return centerColor;
            })
            .attr('cx', function (d) { return d.cx; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', 4)
            .transition()
            .delay(0)
            .duration(DURATION_MS)
            .attr('transform', function (d) {
                return 'translate(' + (WIDTH / 2 - d.cx) + ', 0)';
            });

        g.selectAll('line')
            .data([obj])
            .enter()
            .append('line')
            .transition()
            .delay(DURATION_MS)
            .duration(DURATION_MS)
            .attr('style', function (d, i) {
                return 'stroke: ' + d.color;
            })
            .attr('x1', function (d) {
                return WIDTH / 2;
            })
            .attr('y1', function (d) {
                return 110;
            })
            .attr('x2', function (d) {
                return WIDTH / 2;
            })
            .attr('y2', function (d) {
                return d.y - 10;
            });

        g.selectAll('text')
            .data([obj])
            .enter()
            .append('text')
            .text(obj.nodeName)
            .attr('style', 'fill: ' + obj.color)
            .attr('y', function (d, i) {
                if (d.group === 1) {
                    return d.y + 20;
                } else {
                    return d.y - 20;
                }
            })
            .attr('x', (WIDTH / 2 - (obj.nodeName.length * 6)))
            .transition()
            .delay(0)
            .duration(DURATION_MS)
            .attr('class', 'highlight writer')
            .attr('y', function (d) { return 100; });

        setTimeout(function () {
            drawNewArcs(data, g, centerColor);
        }, 1500);
    }
};
