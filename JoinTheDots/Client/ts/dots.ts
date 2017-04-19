import { lineFunction } from "./helpers";
import * as $ from "jquery";
import * as d3 from "d3";

export class Dots {
    lineData = [];
    nodeArray = [];
    pathIndex = 0;
    allLines = [];
    nodeCount = 0;

    lineFunction;

    constructor() {
        this.lineFunction = lineFunction;
    };

    JoinTheDots() {
        for (var i = 0; i < this.nodeArray.length; i++) {
            this.lineData.push({ "x": this.nodeArray[i].attr("cx"), "y": this.nodeArray[i].attr("cy") });
        }

        this.lineData.push({ "x": this.nodeArray[0].attr("cx"), "y": this.nodeArray[0].attr("cy") });

        //console.log(this.lineData);
        //console.log(this.lineFunction);
        console.log(this.lineFunction(this.lineData));

        var pathContainer = d3.select("#pathContainer");
        pathContainer.append("path")
            .attr("class", "dotPath")
            .attr("id", this.pathIndex)
            .attr("d", this.lineFunction(this.lineData))
            .attr("stroke-width", 2)
            .attr("fill", "#B5E9EA")
            .attr("opacity", "0.5")
            .attr("pathIndex", this.pathIndex);

        this.allLines[this.pathIndex] = this.lineData;
        this.lineData = [];
        this.nodeArray = [];

        d3.selectAll(".textT").remove();
        d3.selectAll(".circle").attr("r", 7)
            .classed("joined_circle", true).
            classed("circle", false);

        this.nodeCount = 0;

        $("#areaText").append('<a class="btn btn-default"></a>');

        $("#areaText a:last-child").addClass("areaTag").attr("pathIndex", this.pathIndex).click(function () {
            var self = this;
            d3.selectAll(".joined_circle").classed("selectedArea", false);
            $(".areaTag").removeClass("selectedArea");
            d3.selectAll(".dotPath").classed("selectedArea", false);
            $(".dotPath").each(function (index) {
                if ($(this).attr("id") === $(self).attr("pathIndex")) {
                    d3.select(this).classed("selectedArea", true);
                    $(self).addClass("selectedArea");
                }
            });
            $(".joined_circle").each(function () {
                if (d3.select(this).attr("pathIndex") === $(self).attr("pathIndex")) {
                    d3.select(this).classed("selectedArea", true);
                }
            })
        }).text("Area: " + (this.pathIndex + 1));

        this.pathIndex++;
    }

    Reset() {
        d3.selectAll("circle").remove();
        d3.selectAll(".textT").remove();
        d3.selectAll(".dotPath").remove();
        d3.select("#areaText").selectAll("*").remove();
        this.nodeCount = 0;
        this.nodeArray = [];
        this.lineData = [];
        this.pathIndex = 0;
    }

    UpdateDots(context, x, y, arrayCount) {
        var self = this;
        var lineData = this.allLines[arrayCount];

        if (lineData != undefined) {
            if (Number($(context).attr("index")) == 0) {
                lineData[lineData.length - 1] = { "x": x, "y": y };
            }

            lineData[Number($(context).attr("index"))] = { "x": x, "y": y };

            var paths = d3.selectAll(".dotPath").each(function (d) {
                var arCount = d3.select(this).attr("id");
                if (arCount === arrayCount) {
                    d3.select(this).attr("d", self.lineFunction(lineData));
                    return false;
                }
            });
        }

    }
}