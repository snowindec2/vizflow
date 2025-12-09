import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CompletionRingProps {
  percentage: number;
}

export const CompletionRing: React.FC<CompletionRingProps> = ({ percentage }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 120;
    const height = 120;
    const radius = Math.min(width, height) / 2;
    const thickness = 10;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Background Arc
    const bgArc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append("path")
      .attr("d", bgArc as any)
      .attr("fill", "#334155");

    // Foreground Arc
    const fgArc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .cornerRadius(5);

    // Animate the arc
    g.append("path")
      .datum({ endAngle: 0 })
      .attr("fill", "#10b981") // Emerald 500
      .attr("d", fgArc as any)
      .transition()
      .duration(1000)
      .attrTween("d", function(d: any) {
        const interpolate = d3.interpolate(d.endAngle, (percentage / 100) * 2 * Math.PI);
        return function(t: any) {
          d.endAngle = interpolate(t);
          return fgArc(d) || "";
        };
      });

    // Text Label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(`${Math.round(percentage)}%`)
      .attr("fill", "white")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif");

  }, [percentage]);

  return <svg ref={svgRef} />;
};
