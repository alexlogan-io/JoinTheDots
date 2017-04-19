import * as d3 from "d3";
import { Dots } from "./dots";
import { alexPixToValX, alexPixToValY, alexValToPixX, alexValToPixY, lineFunction } from "./helpers";

export class Graph {

    width: number;
    height: number;
    radius: number;
    padding: number;

    drag;

    xScale;
    yScale;

    xData: [string];
    xAxis;

    yData: [string];
    yAxis;

    svg;

    lineFunction;

    dots: Dots;

    constructor(targetArea: string) {

        this.width = 1000;
        this.height = 600;
        this.radius = 15;
        this.padding = 30;

        var self = this;

        this.dots = new Dots();

        this.svg = d3.select(targetArea).append("div").selectAll("svg")
            .data(d3.range(1).map(function () { return { x: self.width / 2, y: self.height / 2 }; }))
            .enter().append("svg")
            .attr("width", self.width)
            .attr("height", self.height)
            .on("mousedown", function () {
                self.mousedown(this, self);
            })
            .on("mousemove", function () {
                self.mousemove(this, self);
            })
            .on("contextmenu", function (d, i) {
                d3.event.preventDefault();
                // react on right-clicking
            });

        this.svg.selectAll("*").remove();

        this.lineFunction = lineFunction;

        this.drag = d3.drag()
            .on("drag", function () {
                self.dragMove(this, self);
            });

        this.xScale = d3.scaleLinear()
            .domain([-1000, 1000])
            .range([this.padding, this.width - this.padding * 2]);

        this.yScale = d3.scaleLinear()
            .domain([-1000, 1000])
            .range([this.height - this.padding, this.padding]);

        this.xData = ["One", "Two", "Three", "Four", "Five"];
        this.xAxis = d3.axisBottom(this.xScale)
            .ticks(5)
            .tickFormat(function (d, i) {
                return self.xData[i];
            });

        this.yData = ["One", "Two", "", "Four", "Five"];
        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(5)
            .tickFormat(function (d, i) {
                return self.yData[i];
            });

        this.createAxis(this.xAxis, this.yAxis, this.svg);
    }

    createAxis(xAxis, yAxis, svg) {
        //Create X axis
        svg.append("g")
            .attr("id", "x")
            .attr("class", "axis")
            .attr("transform", "translate(" + (this.padding / 2) + "," + (this.height - this.padding - ((this.height - (this.padding * 2)) / 2)) + ")")
            .call(xAxis);

        //Create Y axis
        svg.append("g")
            .attr("id", "y")
            .attr("class", "axis")
            .attr("transform", "translate(" + (this.padding + ((this.width - (this.padding * 2)) / 2)) + ",0)")
            .call(yAxis);

        svg.append("g")
            .attr("id", "pathContainer");

        svg.append("text")
            .attr("id", "coordText")
            .attr("transform", "translate(" + (this.width - (this.padding * 3) - 20) + "," + (this.height - this.padding + 20) + ")")
            .text("x:0" + " " + "y:0");
    }

    dragMove(context, self: Graph) {
        var point = d3.mouse(context);
        var x = point[0];
        var y = point[1];
        var arrayCount = d3.select(context).attr("pathIndex");
        if (x > self.padding + self.radius && x < ((self.width - (self.padding * 2)) + self.radius) && y < (self.height - self.padding) && y > self.padding) {
            if (d3.select(context).attr("class").indexOf("circle") >= 0) {
                d3.select(context).attr("cx", x);
                d3.select(context).attr("cy", y);
                d3.select(context.parentNode.childNodes[1]).attr("transform", "translate(" + (x - 5) + "," + (y + 5) + ")");
            } else {
                d3.select(context.parentNode.childNodes[0]).attr("cx", x);
                d3.select(context.parentNode.childNodes[0]).attr("cy", y);
                d3.select(context).attr("transform", "translate(" + (x - 5) + "," + (y + 5) + ")")
            }

            self.dots.UpdateDots(context, x, y, arrayCount);

        }
    }

    mousedown(context, self: Graph) {
        if (d3.event.button == 2) {
            if (d3.event.target.className.baseVal.indexOf("circle") >= 0 || d3.event.target.className.baseVal.indexOf("textT") >= 0) {
                var index = Number($(context).attr("index"));
                if (!isNaN(index)) {
                    $(self.dots.nodeArray[index][0]).parent().remove();
                    self.dots.nodeArray.splice(index, 1);
                    for (var i = index; i < self.dots.nodeArray.length; i++) {
                        var elm = $(self.dots.nodeArray[i][0]).parent()[0];
                        $(elm.firstChild).attr("index", i);
                        $(elm.lastChild).text(i + 1);
                    }
                    self.dots.nodeCount -= 1;
                }
            }
        } else {
            if (d3.event.target.className.baseVal.indexOf("circle") === -1 && d3.event.target.className.baseVal.indexOf("textT") === -1 && d3.event.target.className.baseVal.indexOf("dotPath") === -1) {
                var coordinates = [0, 0];
                coordinates = d3.mouse(context);
                var x = coordinates[0];
                var y = coordinates[1];

                var circle = self.drawCircle(self, x, y, self.dots.nodeCount, self.dots.pathIndex);

                self.dots.nodeCount++;

                self.dots.nodeArray.push(circle);
            }
        }
    }

    mousemove(context, self: Graph) {
        var coordinates = [0, 0];
        coordinates = d3.mouse(context);
        var x = Math.round(alexValToPixX(coordinates[0]));
        var y = Math.round(alexValToPixY(coordinates[1]));
        d3.select("#coordText").text("x:" + x + " " + "y:" + y);
    }

    insertRandom() {
        var self = this;
        for (var n = 0; n < 30; n++) {
            var x = alexPixToValX(Math.floor(Math.random() * 2000) - 1000);
            var y = alexPixToValY(Math.floor(Math.random() * 2000) - 1000);

            var circle = this.drawCircle(self, x, y, self.dots.nodeCount, self.dots.pathIndex);

            self.dots.nodeCount++;
            self.dots.nodeArray.push(circle);
        }
    }

    drawCircle(self, x, y, count, arrayCount) {
        var container = self.svg.append("g");

        var circle = container.append("circle")
            .attr("index", count)
            .attr("class", "circle")
            .attr("fill", "#B5E9EA")
            .attr("r", self.radius)
            .attr("cx", x)
            .attr("cy", y)
            .attr("pathIndex", arrayCount)
            .on("mousedown", function () {
                self.mousedown(this, self);
            })
            .call(self.drag);

        var text = container.append("text")
            .attr("class", "textT")
            .text((count + 1))
            .attr("transform", "translate(" + (x - 5) + "," + (y + 5) + ")")
            .attr("id", count)
            .attr("pathIndex", arrayCount)
            .attr("fill", "#00414A")
            .call(self.drag);

        return circle;
    }

    Save() {
        var stringLines = { dots: this.dots.allLines };
        console.log(JSON.stringify(stringLines));
        $.ajax({
            method: "POST",
            url: "/api/dots",
            data: JSON.stringify(stringLines),
            contentType: "application/json"
        }).fail(function (res) {
            console.log(res);
            console.log("failed");
        });
    }

    Load() {
        var self = this;
        $.ajax({
            method: "GET",
            url: "/api/dots"
        }).done(function (res) {
            self.dots.Reset();
            var dots = JSON.parse(res).dots;
            for (var j = 0; j < dots.length; j++) {
                var nodeArray = dots[j];
                for (var i = 0; i < nodeArray.length; i++) {
                    //dont render dots twice
                    var circle = self.drawCircle(self, nodeArray[i].x, nodeArray[i].y, i, j);
                    self.dots.nodeArray.push(circle);
                }
                self.dots.JoinTheDots();
            }
        });
    }
}