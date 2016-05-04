Raphael(function () {

    // TOC
    (function (ol) {
        if (!ol) {
            return;
        }
        var li = document.createElement("li"),
            isABBR = function (str, abbr) {
                var letters = abbr.toUpperCase().split(""),
                    first = letters.shift(),
                    rg = new RegExp("^[" + first.toLowerCase() + first + "][a-z]*" + letters.join("[a-z]*") + "[a-z]*$");
                return !!String(str).match(rg);
            },
            score = function (me, search) {
                me = String(me);
                search = String(search);
                var score = 0,
                    chunk;
                if (me == search) {
                    return 1;
                }
                if (!me || !search) {
                    return 0;
                }
                if (isABBR(me, search)) {
                    return .9;
                }
                score = 0;
                chunk = me.toLowerCase();
                for (var j, i = 0, ii = search.length; i < ii; i++) {
                    j = chunk.indexOf(search.charAt(i));
                    if (~j) {
                        chunk = chunk.substring(j + 1);
                        score += 1 / (j + 1);
                    }
                }
                score = Math.max(score / ii - Math.abs(me.length - ii) / me.length / 2, 0);
                return score;
            };
        li.innerHTML = '<input type="search" id="dr-filter" results="0">';
        var lis = ol.getElementsByTagName("span"),
            names = [],
            rgName = /[^\.\(]*(?=(\(\))?$)/;
        for (var i = 0, ii = lis.length; i < ii; i++) {
            names[i] = {
                li: lis[i].parentNode.parentNode,
                text: lis[i].innerHTML.match(rgName)[0]
            };
        }
        ol.insertBefore(li, ol.firstChild);
        var input = document.getElementById("dr-filter");
        input.style.width = "100%";
        input.style.marginTop = "10px";
        input.onclick = input.onchange = input.onkeydown = input.onkeyup = function () {
            var v = input.value,
                res = [];
            if (v.length > 1) {
                for (var i = 0, ii = names.length; i < ii; i++) {
                    res[i] = {
                        li: names[i].li,
                        weight: score(names[i].text, v)
                    };
                }
                res.sort(function (a, b) {
                    return b.weight - a.weight;
                });
                for (i = 0, ii = res.length; i < ii; i++) {
                    ol.appendChild(res[i].li);
                }
            } else {
                for (i = 0, ii = names.length; i < ii; i++) {
                    ol.appendChild(names[i].li);
                }
            }
        };
    })(document.getElementById("dr-toc"));

    function prepare(id) {
        var div = document.getElementById(id);
        div.style.cssText = "float:right;padding:10px;width:99px;height:99px;background:#2C53B0 url(http://raphaeljs.com/blueprint-min.png) no-repeat";
        return Raphael(div, 99, 99);
    }

    var line = {
            stroke: "#fff",
            "stroke-width": 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        },
        dots = {
            stroke: "#fff",
            "stroke-width": 2,
            "stroke-dasharray": "- ",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        },
        fill = {
            stroke: "#fff",
            fill: "#fff",
            "fill-opacity": .5,
            "stroke-width": 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        },
        none = {
            fill: "#000",
            opacity: 0
        };
    prepare("Paper.path-extra").path("M10,10R90,50 10,90").attr(line);

    (function (r) {
        var there;
        r.circle(15, 15, 10).attr(fill).click(function () {
            var clr = Raphael.hsb(Math.random(), .6, 1);
            this.animate(there ? {
                cx: 15,
                cy: 15,
                r: 10,
                stroke: "#fff",
                fill: "#fff"
            } : {
                cx: 80,
                cy: 80,
                r: 15,
                stroke: clr,
                fill: clr
            }, 600, ["bounce", "<>", "elastic", ""][Math.round(Math.random() * 3)]);
            there = !there;
        });
    })(prepare("Element.animate-extra"));

    (function (r) {
        var x, y;
        r.circle(15, 15, 10).attr(fill).drag(function (dx, dy) {
            this.attr({
                cx: Math.min(Math.max(x + dx, 15), 85),
                cy: Math.min(Math.max(y + dy, 15), 85)
            });
        }, function () {
            x = this.attr("cx");
            y = this.attr("cy");
        });

    })(prepare("Element.drag-extra"));

    (function (r) {
        var e = r.ellipse(50, 50, 40, 30).attr(fill).click(function () {
                this.animate({
                    transform: "r180"
                }, 1000, function () {
                    this.attr({
                        transform: ""
                    });
                });
            }),
            bb = r.rect().attr(e.getBBox()).attr(dots);
        eve.on("anim.frame." + e.id, function (anim) {
            bb.attr(e.getBBox());
        });
    })(prepare("Element.getBBox-extra"));

    (function (r) {
        var e = r.path("M10,10R20,70 30,40 40,80 50,10 60,50 70,20 80,30 90,90").attr(line),
            l = e.getTotalLength(),
            to = 1;
        r.customAttributes.along = function (a) {
            var p = e.getPointAtLength(a * l);
            return {
                transform: "t" + [p.x, p.y] + "r" + p.alpha
            };
        };
        var c = r.ellipse(0, 0, 5, 2).attr({
            along: 0
        }).attr(line);
        r.rect(0, 0, 100, 100).attr(none).click(function () {
            c.stop().animate({
                along: to
            }, 5000);
            to = +!to;
        });
    })(prepare("Element.getPointAtLength-extra"));

    (function (r) {
        var e = r.path("M10,10R20,70 30,40 40,80 50,10 60,50 70,20 80,30 90,90").attr(line),
            l = e.getTotalLength() - 10,
            to = 1;
        r.customAttributes.along = function (a) {
            return {
                path: e.getSubpath(a * l, a * l + 11)
            };
        };
        var c = r.path().attr(line).attr({
            along: 0,
            stroke: "#f00",
            "stroke-width": 3
        });
        r.rect(0, 0, 100, 100).attr(none).click(function () {
            c.stop().animate({
                along: to
            }, 5000);
            to = +!to;
        });
    })(prepare("Element.getSubpath-extra"));

    (function (r) {
        r.circle(50, 50, 40).attr(line).glow({color: "#fff"});
    })(prepare("Element.glow-extra"));

    (function (r) {
        r.rect(10, 10, 40, 30).attr(dots);
        r.rect(10, 10, 40, 30).attr(line).transform("r-30, 50, 10t10, 20s1.5");
        r.text(50, 90, "r-30, 50, 10\nt10, 20s1.5").attr({fill: "#fff"});
    })(prepare("Element.transform-extra"));

    (function (r) {
        r.circle(50, 50, 40).attr(line);
    })(prepare("Paper.circle-extra"));

    (function (r) {
        r.ellipse(50, 50, 40, 30).attr(line);
    })(prepare("Paper.ellipse-extra"));

    (function (r) {
        r.rect(10, 10, 50, 50).attr(line);
        r.rect(40, 40, 50, 50, 10).attr(line);
    })(prepare("Paper.rect-extra"));

    (function (r) {
        var set = r.set(
            r.rect(10, 10, 50, 50).attr(fill),
            r.rect(40, 40, 50, 50, 10).attr(fill)
        ).hover(function () {
            set.stop().animate({stroke: "#f00"}, 600, "<>");
        }, function () {
            set.stop().animate({stroke: "#fff"}, 600, "<>");
        });
    })(prepare("Paper.set-extra"));

    (function (r) {
        r.text(50, 50, "Raphaël\nkicks\nbutt!").attr({
            fill: "#fff",
            font: "italic 20px Georgia",
            transform: "r-10"
        });
    })(prepare("Paper.text-extra"));

});

/*************************Перетаскивание************************/
Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
            {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
            {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
            {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
            {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
            {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
            {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
            {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};


var el;
window.onload = function () {
    var dragger = function () {
            this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
            this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
            this.animate({"fill-opacity": .2}, 500);
        },
        move = function (dx, dy) {
            var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
            r.safari();
        },
        up = function () {
            this.animate({"fill-opacity": 0}, 500);
        },
        r = Raphael("holder", 640, 480),
        connections = [],
        shapes = [  r.ellipse(190, 100, 30, 20),
            r.rect(290, 80, 60, 40, 10),
            r.rect(290, 180, 60, 40, 2),
            r.ellipse(450, 100, 20, 20)
        ];
    for (var i = 0, ii = shapes.length; i < ii; i++) {
        var color = Raphael.getColor();
        shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        shapes[i].drag(move, dragger, up);
    }
    connections.push(r.connection(shapes[0], shapes[1], "#fff"));
    connections.push(r.connection(shapes[1], shapes[2], "#fff", "#fff|5"));
    connections.push(r.connection(shapes[1], shapes[3], "#000", "#fff"));
};
