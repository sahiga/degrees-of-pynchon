class GraphState {
    constructor(svgElement, hasMultiple) {
        this.hasMultiple = hasMultiple;
        this.svgElement = svgElement;
    }

    setHasMultiple = (value) => {
        this.hasMultiple = value;
    }

    getHasMultiple = () => {
        return this.hasMultiple;
    }

    getSVGElement = () => {
        return this.svgElement;
    }
}

const svg = d3.select('svg')
    .attr('width', WIDTH + MARGIN.right + MARGIN.left)
    .attr('height', HEIGHT);

const graphState = new GraphState(svg, false);
