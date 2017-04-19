const $ = require('expose-loader?$!expose-loader?jQuery!jquery');
import { Graph } from "./graph";

import "../css/site.css";

$(document).ready(function () {
    var graph = new Graph("#d3QuestionArea");

    $("#JoinButton").click(function () {
        graph.dots.JoinTheDots()
    });

    $("#ResetButton").on("click", function () {
        graph.dots.Reset();
    });

    $("#SaveButton").on("click", function () {
        graph.Save();
    });

    $("#LoadButton").on("click", function () {
        graph.Load();
    });

    $("#RandomButton").on("click", function () {
        graph.insertRandom();
    });
});