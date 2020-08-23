var _TD = {
	a: [],
	retina: window.devicePixelRatio || 1, // 视网膜 设备像素比
	init: function(t, i) {
		delete this.init
		let s = {
			version: "0.1.18",
			is_debug: !! i,
			is_paused: !0,
			width: 16,
			height: 16,
			show_monster_life: !0,
			fps: 0,   // 每秒帧数
			exp_fps: 24,
			exp_fps_half: 12,
			exp_fps_quarter: 6,
			exp_fps_eighth: 4,
			stage_data: {},
			defaultSettings: function() {   // 默认设置
				return {
					step_time: 36,
					grid_size: 32 * _TD.retina,
					padding: 10 * _TD.retina,
					global_speed: .1
				}
			},
			init: function(t) {  // 初始化
				this.obj_board = s.lang.$e(t);
        this.canvas = this.obj_board.getElementsByTagName("canvas")[0];
        if (this.canvas.getContext) {
          this.ctx = this.canvas.getContext("2d")
          this.monster_type_count = s.getDefaultMonsterAttributes()
          this.iframe = 0
          this.last_iframe_time = (new Date).getTime()
          this.fps = 0
          this.start()
        }
			},
			start: function() {   // 开始游戏
        clearTimeout(this._st)
        s.log("Start!");
        let t = this;
        this._exp_fps_0 = this.exp_fps - 0.4
        this._exp_fps_1 = this.exp_fps + 0.4
        this.mode = "normal"
        this.eventManager.clear()
        this.lang.mix(this, this.defaultSettings())
        this.stage = new s.Stage("stage-main", s.getDefaultStageData("stage_main"))
        this.canvas.setAttribute("width", this.stage.width)
        this.canvas.setAttribute("height", this.stage.height)
        this.canvas.style.width = this.stage.width / _TD.retina + "px"
        this.canvas.style.height = this.stage.height / _TD.retina + "px"
        this.canvas.onmousemove = function(i) {
          var e = t.getEventXY.call(t, i);
          t.hover(e[0], e[1])
        }
        this.canvas.onclick = function(i) {
          var e = t.getEventXY.call(t, i);
          t.click(e[0], e[1])
        }
        this.is_paused = !1
        this.stage.start()
        this.step()
        return this
			},
			checkCheat: function(t) {
				switch (t) {
				case "money+":
					this.money += 1e6, this.log("cheat success!");
					break;
				case "life+":
					this.life = 100, this.log("cheat success!");
					break;
				case "life-":
					this.life = 1, this.log("cheat success!");
					break;
				case "difficulty+":
					this.difficulty *= 2, this.log("cheat success! difficulty = " + this.difficulty);
					break;
				case "difficulty-":
					this.difficulty /= 2, this.log("cheat success! difficulty = " + this.difficulty)
				}
			},
			step: function() { // 步
        if(this.is_debug && _TD && _TD.cheat){
          this.checkCheat(_TD.cheat)
          _TD.cheat = ""
        }
        if (!this.is_paused) {  // 不是暂停
          this.iframe++
					if (this.iframe % 50 == 0) {
						let t = (new Date).getTime(), i = this.step_time;
            this.fps = Math.round(5e5 / (t - this.last_iframe_time)) / 10,
                      this.last_iframe_time = t,
                      this.fps < this._exp_fps_0 && i > 1 ?
                        i-- :
                        this.fps > this._exp_fps_1 && i++,
                      this.step_time = i
					}
          this.iframe % 2400 == 0 && s.gc()
          this.stage.step()
          this.stage.render()
					this._st = setTimeout(() => {
            this.step()
					}, this.step_time)
				}
			},
			getEventXY: function(t) {  // 获取x y 坐标
				var i = s.lang.$e("wrapper"),
					e = t.clientX - i.offsetLeft - this.canvas.offsetLeft + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
					n = t.clientY - i.offsetTop - this.canvas.offsetTop + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				return [e * _TD.retina, n * _TD.retina]
			},
			hover: function(t, i) {
				this.eventManager.hover(t, i)
			},
			click: function(t, i) {
				this.eventManager.click(t, i)
			},
			mouseHand: function(t) {  // 鼠标手
				this.canvas.style.cursor = t ? "pointer" : "default"
			},
			log: function(t) {  // 打印
				this.is_debug && window.console && console.log && void 0
			},
			gc: function() {  // 垃圾回收
				window.CollectGarbage && (CollectGarbage(), requestAnimationFrame(CollectGarbage))
			}
		};
		let e = 0
		while(this.a[e]){
			this.a[e++](s)
		}
		delete this.a
		s.init(t)
	}
};
_TD.a.push(function(t) {
	t.lang = {
		$e: function(t) {
			return document.getElementById(t)
		},
		$c: function(t, i, e) {
			var s = document.createElement(t);
			i = i || {};
			for (var n in i) i.hasOwnProperty(n) && s.setAttribute(n, i[n]);
			return e && e.appendChild(s), s
		},
		strLeft: function(t, i) {
			var e = t.slice(0, i),
				s = e.replace(/[^-ÿ]/g, "**").length;
			if (i >= s) return e;
			switch (s -= e.length) {
			case 0:
				return e;
			case i:
				return t.slice(0, i >> 1);
			default:
				var n = i - s,
					h = t.slice(n, i),
					a = h.replace(/[-ÿ]/g, "").length;
				return a ? t.slice(0, n) + this.arguments.callee(h, a) : t.slice(0, n)
			}
		},
		strLen2: function(t) {
			return t.replace(/[^-ÿ]/g, "**").length
		},
		each: function(t, i) {
			if (Array.prototype.forEach) t.forEach(i);
			else for (var e = 0, s = t.length; s > e; e++) i(t[e])
		},
		any: function(t, i) {
			for (var e = 0, s = t.length; s > e; e++) if (i(t[e])) return t[e];
			return null
		},
		shift: function(t, i) {
			for (; t[0];) i(t.shift())
		},
		rndSort: function(t) {
			var i = t.concat();
			return i.sort(function() {
				return Math.random() - .5
			})
		},
		_rndRGB2: function(t) {
			var i = t.toString(16);
			return 2 == i.length ? i : "0" + i
		},
		rndRGB: function() {
			var t = Math.floor(256 * Math.random()),
				i = Math.floor(256 * Math.random()),
				e = Math.floor(256 * Math.random());
			return "#" + this._rndRGB2(t) + this._rndRGB2(i) + this._rndRGB2(e)
		},
		rgb2Arr: function(t) {
			if (7 != t.length) return [0, 0, 0];
			var i = t.substr(1, 2),
				e = t.substr(3, 2),
				s = t.substr(3, 2);
			return [parseInt(i, 16), parseInt(e, 16), parseInt(s, 16)]
		},
		rndStr: function(t) {
			t = t || 16;
			var i, e, s = "1234567890abcdefghijklmnopqrstuvwxyz",
				n = [],
				h = s.length;
			for (i = 0; t > i; i++) e = Math.floor(Math.random() * h), n.push(s.substr(e, 1));
			return n.join("")
		},
		nullFunc: function() {},
		arrayEqual: function(t, i) {
			var e, s = t.length;
			if (s != i.length) return !1;
			for (e = 0; s > e; e++) if (t[e] != i[e]) return !1;
			return !0
		},
		mix: function(t, i, e) {
			if (!i || !t) return t;
			for (var s in i)!i.hasOwnProperty(s) || e === !1 && s in t || (t[s] = i[s]);
			return t
		}
	}
});
 _TD.a.push(function(t) {
	t.eventManager = {
		ex: -1,
		ey: -1,
		_registers: {},
		ontypes: ["enter", "hover", "out", "click"],
		current_type: "hover",
		isOn: function(t) {
			return -1 != this.ex && -1 != this.ey && this.ex > t.x && this.ex < t.x2 && this.ey > t.y && this.ey < t.y2
		},
		_mkElEvtName: function(t, i) {
			return t.id + "::_evt_::" + i
		},
		on: function(t, i, e) {
			this._registers[this._mkElEvtName(t, i)] = [t, i, e]
		},
		removeEventListener: function(t, i) {
			var e = this._mkElEvtName(t, i);
			delete this._registers[e]
		},
		clear: function() {
			delete this._registers, this._registers = {}
		},
		step: function() {
			if (this.current_type) {
				var i, e, s, n, h, a, l, r = this,
					c = this.ontypes.length,
					o = [];
				for (i in this._registers) this._registers.hasOwnProperty(i) && (e = this._registers[i], s = e[0], n = e[1], h = e[2], s.is_valid ? s.is_visiable && (l = this.isOn(s), "click" != this.current_type ? "hover" == n && s.is_hover && l ? (h(), this.current_type = "hover") : "enter" == n && !s.is_hover && l ? (s.is_hover = !0, h(), this.current_type = "enter") : "out" == n && s.is_hover && !l && (s.is_hover = !1, h(), this.current_type = "out") : l && "click" == n && h()) : o.push(s));
				t.lang.each(o, function(t) {
					for (a = 0; c > a; a++) r.removeEventListener(t, r.ontypes[a])
				}), this.current_type = ""
			}
		},
		hover: function(t, i) {
			"click" != this.current_type && (this.current_type = "hover", this.ex = t, this.ey = i)
		},
		click: function(t, i) {
			this.current_type = "click", this.ex = t, this.ey = i
		}
	}
});
 _TD.a.push(function(t) {
	t.Stage = function(i, e) {
		this.id = i || "stage-" + t.lang.rndStr(), this.cfg = e || {}, this.width = this.cfg.width || 640, this.height = this.cfg.height || 540, this.mode = "normal", this.state = 0, this.acts = [], this.current_act = null, this._step2 = t.lang.nullFunc, this._init()
	}, t.Stage.prototype = {
		_init: function() {
			"function" == typeof this.cfg.init && this.cfg.init.call(this), "function" == typeof this.cfg.step2 && (this._step2 = this.cfg.step2)
		},
		start: function() {
			this.state = 1, t.lang.each(this.acts, function(t) {
				t.start()
			})
		},
		pause: function() {
			this.state = 2
		},
		gameover: function() {
			this.current_act.gameover()
		},
		clear: function() {
			this.state = 3, t.lang.each(this.acts, function(t) {
				t.clear()
			})
		},
		step: function() {
			1 == this.state && this.current_act && (t.eventManager.step(), this.current_act.step(), this._step2())
		},
		render: function() {
			0 != this.state && 3 != this.state && this.current_act && this.current_act.render()
		},
		addAct: function(t) {
			this.acts.push(t)
		},
		addElement: function(t, i, e) {
			this.current_act && this.current_act.addElement(t, i, e)
		}
	}
});
 _TD.a.push(function(t) {
	t.Act = function(i, e) {
		this.stage = i, this.id = e || "act-" + t.lang.rndStr(), this.state = 0, this.scenes = [], this.end_queue = [], this.current_scene = null, this._init()
	}, t.Act.prototype = {
		_init: function() {
			this.stage.addAct(this)
		},
		start: function() {
			return this.stage.current_act && 3 != this.stage.current_act.state ? (this.state = 0, void this.stage.current_act.queue(this.start)) : (this.state = 1, this.stage.current_act = this, void t.lang.each(this.scenes, function(t) {
				t.start()
			}))
		},
		pause: function() {
			this.state = 2
		},
		end: function() {
			this.state = 3;
			for (var t; t = this.end_queue.shift();) t();
			this.stage.current_act = null
		},
		queue: function(t) {
			this.end_queue.push(t)
		},
		clear: function() {
			this.state = 3, t.lang.each(this.scenes, function(t) {
				t.clear()
			})
		},
		step: function() {
			1 == this.state && this.current_scene && this.current_scene.step()
		},
		render: function() {
			0 != this.state && 3 != this.state && this.current_scene && this.current_scene.render()
		},
		addScene: function(t) {
			this.scenes.push(t)
		},
		addElement: function(t, i, e) {
			this.current_scene && this.current_scene.addElement(t, i, e)
		},
		gameover: function() {
			this.current_scene.gameover()
		}
	}
});
 _TD.a.push(function(t) {
	t.Scene = function(i, e) {
		this.act = i, this.stage = i.stage, this.is_gameover = !1, this.id = e || "scene-" + t.lang.rndStr(), this.state = 0, this.end_queue = [], this._step_elements = [
			[],
			[],
			[]
		], this._render_elements = [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		], this._init()
	}, t.Scene.prototype = {
		_init: function() {
			this.act.addScene(this), this.wave = 0
		},
		start: function() {
			return this.act.current_scene && this.act.current_scene != this && 3 != this.act.current_scene.state ? (this.state = 0, void this.act.current_scene.queue(this.start)) : (this.state = 1, void(this.act.current_scene = this))
		},
		pause: function() {
			this.state = 2
		},
		end: function() {
			this.state = 3;
			for (var t; t = this.end_queue.shift();) t();
			this.clear(), this.act.current_scene = null
		},
		clear: function() {
			t.lang.shift(this._step_elements, function(i) {
				t.lang.shift(i, function(t) {
					t.del()
				})
			}), t.lang.shift(this._render_elements, function(i) {
				t.lang.shift(i, function(t) {
					t.del()
				})
			})
		},
		queue: function(t) {
			this.end_queue.push(t)
		},
		gameover: function() {
			this.is_gameover || (this.pause(), this.is_gameover = !0)
		},
		step: function() {
			if (1 == this.state) {
				t.life <= 0 && (t.life = 0, this.gameover());
				var i, e;
				for (i = 0; 3 > i; i++) {
					e = [];
					var s = this._step_elements[i];
					t.lang.shift(s, function(t) {
						t.is_valid ? (t.is_paused || t.step(), e.push(t)) : setTimeout(function() {
							t = null
						}, 500)
					}), this._step_elements[i] = e
				}
			}
		},
		render: function() {
			if (0 != this.state && 3 != this.state) {
				var i, e, s = t.ctx;
				for (s.clearRect(0, 0, this.stage.width, this.stage.height), i = 0; 10 > i; i++) {
					e = [];
					var n = this._render_elements[i];
					t.lang.shift(n, function(t) {
						t.is_valid && (t.is_visiable && t.render(), e.push(t))
					}), this._render_elements[i] = e
				}
				this.is_gameover && this.panel.gameover_obj.show()
			}
		},
		addElement: function(t, i, e) {
			i = i || t.step_level || 1, e = e || t.render_level, this._step_elements[i].push(t), this._render_elements[e].push(t), t.scene = this, t.step_level = i, t.render_level = e
		}
	}
});
 _TD.a.push(function(t) {
	t.Element = function(i, e) {
		this.id = i || "el-" + t.lang.rndStr(), this.cfg = e || {}, this.is_valid = !0, this.is_visiable = "undefined" != typeof e.is_visiable ? e.is_visiable : !0, this.is_paused = !1, this.is_hover = !1, this.x = this.cfg.x || -1, this.y = this.cfg.y || -1, this.width = this.cfg.width || 0, this.height = this.cfg.height || 0, this.step_level = e.step_level || 1, this.render_level = e.render_level, this.on_events = e.on_events || [], this._init()
	}, t.Element.prototype = {
		_init: function() {
			var t, i, e, s = this;
			for (t = 0, e = this.on_events.length; e > t; t++) switch (i = this.on_events[t]) {
			case "enter":
				this.on("enter", function() {
					s.onEnter()
				});
				break;
			case "out":
				this.on("out", function() {
					s.onOut()
				});
				break;
			case "hover":
				this.on("hover", function() {
					s.onHover()
				});
				break;
			case "click":
				this.on("click", function() {
					s.onClick()
				})
			}
			this.caculatePos()
		},
		caculatePos: function() {
			this.cx = this.x + this.width / 2, this.cy = this.y + this.height / 2, this.x2 = this.x + this.width, this.y2 = this.y + this.height
		},
		start: function() {
			this.is_paused = !1
		},
		pause: function() {
			this.is_paused = !0
		},
		hide: function() {
			this.is_visiable = !1, this.onOut()
		},
		show: function() {
			this.is_visiable = !0
		},
		del: function() {
			this.is_valid = !1
		},
		on: function(i, e) {
			t.eventManager.on(this, i, e)
		},
		onEnter: t.lang.nullFunc,
		onOut: t.lang.nullFunc,
		onHover: t.lang.nullFunc,
		onClick: t.lang.nullFunc,
		step: t.lang.nullFunc,
		render: t.lang.nullFunc,
		addToScene: function(i, e, s, n) {
			this.scene = i, isNaN(e) || (this.step_level = e || this.step_level, this.render_level = s || this.render_level, n && t.lang.each(n, function(t) {
				i.addElement(t, e, s)
			}), i.addElement(this, e, s))
		}
	}
});
 _TD.a.push(function(t) {
	function i(i, e) {
		var s = new t.Element(i, e);
		return t.lang.mix(s, h), s._init(e), s
	}
	var e = 20,
		s = {
			_init: function(s) {
				s = s || {}, this.grid_x = s.grid_x || 10, this.grid_y = s.grid_y || 10, this.x = s.x || 0, this.y = s.y || 0, this.width = this.grid_x * t.grid_size, this.height = this.grid_y * t.grid_size, this.x2 = this.x + this.width, this.y2 = this.y + this.width, this.grids = [], this.entrance = this.exit = null, this.buildings = [], this.monsters = [], this.bullets = [], this.scene = s.scene, this.is_main_map = !! s.is_main_map, this.select_hl = t.MapSelectHighLight(this.id + "-hl", {
					map: this
				}), this.select_hl.addToScene(this.scene, 1, 9), this.selected_building = null, this._wait_clearInvalidElements = e, this._wait_add_monsters = 0, this._wait_add_monsters_arr = [], this.is_main_map && (this.mmm = new i(this.id + "-mmm", {
					map: this
				}), this.mmm.addToScene(this.scene, 1, 7));
				var n, h, a, l = this.grid_x * this.grid_y,
					r = s.grid_data || [];
				for (n = 0; l > n; n++) h = r[n] || {}, h.mx = n % this.grid_x, h.my = Math.floor(n / this.grid_x), h.map = this, h.step_level = this.step_level, h.render_level = this.render_level, a = new t.Grid(this.id + "-grid-" + h.mx + "-" + h.my, h), this.grids.push(a);
				s.entrance && s.exit && !t.lang.arrayEqual(s.entrance, s.exit) && (this.entrance = this.getGrid(s.entrance[0], s.entrance[1]), this.entrance.is_entrance = !0, this.exit = this.getGrid(s.exit[0], s.exit[1]), this.exit.is_exit = !0);
				var c = this;
				s.grids_cfg && t.lang.each(s.grids_cfg, function(t) {
					var i = c.getGrid(t.pos[0], t.pos[1]);
					i && (isNaN(t.passable_flag) || (i.passable_flag = t.passable_flag), isNaN(t.build_flag) || (i.build_flag = t.build_flag), t.building && i.addBuilding(t.building))
				})
			},
			checkHasWeapon: function() {
				this.has_weapon = null != this.anyBuilding(function(t) {
					return t.is_weapon
				})
			},
			getGrid: function(t, i) {
				var e = i * this.grid_x + t;
				return this.grids[e]
			},
			anyMonster: function(i) {
				return t.lang.any(this.monsters, i)
			},
			anyBuilding: function(i) {
				return t.lang.any(this.buildings, i)
			},
			anyBullet: function(i) {
				return t.lang.any(this.bullets, i)
			},
			eachBuilding: function(i) {
				t.lang.each(this.buildings, i)
			},
			eachMonster: function(i) {
				t.lang.each(this.monsters, i)
			},
			eachBullet: function(i) {
				t.lang.each(this.bullets, i)
			},
			preBuild: function(i) {
				t.mode = "build", this.pre_building && this.pre_building.remove(), this.pre_building = new t.Building(this.id + "-pre-building-" + t.lang.rndStr(), {
					type: i,
					map: this,
					is_pre_building: !0
				}), this.scene.addElement(this.pre_building, 1, this.render_level + 1)
			},
			cancelPreBuild: function() {
				t.mode = "normal", this.pre_building && this.pre_building.remove()
			},
			clearInvalidElements: function() {
				if (this._wait_clearInvalidElements > 0) return void this._wait_clearInvalidElements--;
				this._wait_clearInvalidElements = e;
				var i = [];
				t.lang.shift(this.buildings, function(t) {
					t.is_valid && i.push(t)
				}), this.buildings = i, i = [], t.lang.shift(this.monsters, function(t) {
					t.is_valid && i.push(t)
				}), this.monsters = i, i = [], t.lang.shift(this.bullets, function(t) {
					t.is_valid && i.push(t)
				}), this.bullets = i
			},
			addMonster: function(i) {
				this.entrance && ("number" == typeof i && (i = new t.Monster(null, {
					idx: i,
					difficulty: t.difficulty,
					step_level: this.step_level,
					render_level: this.render_level + 2
				})), this.entrance.addMonster(i))
			},
			addMonsters: function(t, i) {
				this._wait_add_monsters = t, this._wait_add_monsters_objidx = i
			},
			addMonsters2: function(t) {
				this._wait_add_monsters_arr = t
			},
			checkPassable: function(t, i) {
				var e = this.getGrid(t, i);
				return null != e && 1 == e.passable_flag && 2 != e.build_flag
			},
			step: function() {
				if (this.clearInvalidElements(), this._wait_add_monsters > 0) this.addMonster(this._wait_add_monsters_objidx), this._wait_add_monsters--;
				else if (this._wait_add_monsters_arr.length > 0) {
					var t = this._wait_add_monsters_arr.shift();
					this.addMonsters(t[0], t[1])
				}
			},
			render: function() {
				var i = t.ctx;
				i.strokeStyle = "#99a", i.lineWidth = _TD.retina, i.beginPath(), i.strokeRect(this.x + .5, this.y + .5, this.width, this.height), i.closePath(), i.stroke()
			},
			onOut: function() {
				this.is_main_map && this.pre_building && this.pre_building.hide()
			}
		};
	t.Map = function(i, e) {
		e.on_events = ["enter", "out"];
		var n = new t.Element(i, e);
		return t.lang.mix(n, s), n._init(e), n
	};
	var n = {
		_init: function(i) {
			this.map = i.map, this.width = t.grid_size + 2, this.height = t.grid_size + 2, this.is_visiable = !1
		},
		show: function(t) {
			this.x = t.x, this.y = t.y, this.is_visiable = !0
		},
		render: function() {
			var i = t.ctx;
			i.lineWidth = 2, i.strokeStyle = "#f93", i.beginPath(), i.strokeRect(this.x, this.y, this.width - 1, this.height - 1), i.closePath(), i.stroke()
		}
	};
	t.MapSelectHighLight = function(i, e) {
		var s = new t.Element(i, e);
		return t.lang.mix(s, n), s._init(e), s
	};
	var h = {
		_init: function(t) {
			this.map = t.map, this.x1 = this.map.x, this.y1 = this.map.y, this.x2 = this.map.x2 + 1, this.y2 = this.map.y2 + 1, this.w = this.map.scene.stage.width, this.h = this.map.scene.stage.height, this.w2 = this.w - this.x2, this.h2 = this.h - this.y2
		},
		render: function() {
			var i = t.ctx;
			i.fillStyle = "#fff", i.beginPath(), i.fillRect(0, 0, this.x1, this.h), i.fillRect(0, 0, this.w, this.y1), i.fillRect(0, this.y2, this.w, this.h2), i.fillRect(this.x2, 0, this.w2, this.h), i.closePath(), i.fill()
		}
	}
});
 _TD.a.push(function(t) {
	var i = {
		_init: function(i) {
			i = i || {}, this.map = i.map, this.scene = this.map.scene, this.mx = i.mx, this.my = i.my, this.width = t.grid_size, this.height = t.grid_size, this.is_entrance = this.is_exit = !1, this.passable_flag = 1, this.build_flag = 1, this.building = null, this.caculatePos()
		},
		caculatePos: function() {
			this.x = this.map.x + this.mx * t.grid_size, this.y = this.map.y + this.my * t.grid_size, this.x2 = this.x + t.grid_size, this.y2 = this.y + t.grid_size, this.cx = Math.floor(this.x + t.grid_size / 2), this.cy = Math.floor(this.y + t.grid_size / 2)
		},
		checkBlock: function() {
			if (this.is_entrance || this.is_exit) return this._block_msg = t._t("entrance_or_exit_be_blocked"), !0;
			var i, e = this,
				s = new t.FindWay(this.map.grid_x, this.map.grid_y, this.map.entrance.mx, this.map.entrance.my, this.map.exit.mx, this.map.exit.my, function(t, i) {
					return !(t == e.mx && i == e.my) && e.map.checkPassable(t, i)
				});
			return i = s.is_blocked, i ? this._block_msg = t._t("blocked") : (i = !! this.map.anyMonster(function(t) {
				return t.chkIfBlocked(e.mx, e.my)
			}), i && (this._block_msg = t._t("monster_be_blocked"))), i
		},
		buyBuilding: function(i) {
			var e = t.getDefaultBuildingAttributes(i).cost || 0;
			t.money >= e ? (t.money -= e, this.addBuilding(i)) : (t.log(t._t("not_enough_money", [e])), this.scene.panel.balloontip.msg(t._t("not_enough_money", [e]), this))
		},
		addBuilding: function(i) {
			this.building && this.removeBuilding();
			var e = new t.Building("building-" + i + "-" + t.lang.rndStr(), {
				type: i,
				step_level: this.step_level,
				render_level: this.render_level
			});
			e.locate(this), this.scene.addElement(e, this.step_level, this.render_level + 1), this.map.buildings.push(e), this.building = e, this.build_flag = 2, this.map.checkHasWeapon(), this.map.pre_building && this.map.pre_building.hide()
		},
		removeBuilding: function() {
			2 == this.build_flag && (this.build_flag = 1), this.building && this.building.remove(), this.building = null
		},
		addMonster: function(t) {
			t.beAddToGrid(this), this.map.monsters.push(t), t.start()
		},
		hightLight: function(t) {
			this.map.select_hl[t ? "show" : "hide"](this)
		},
		render: function() {
			var i = t.ctx,
				e = this.x + .5,
				s = this.y + .5;
			this.is_hover && (i.fillStyle = "rgba(255, 255, 200, 0.2)", i.beginPath(), i.fillRect(e, s, this.width, this.height), i.closePath(), i.fill()), 0 == this.passable_flag && (i.fillStyle = "#fcc", i.beginPath(), i.fillRect(e, s, this.width, this.height), i.closePath(), i.fill()), (this.is_entrance || this.is_exit) && (i.lineWidth = 1, i.fillStyle = "#ccc", i.beginPath(), i.fillRect(e, s, this.width, this.height), i.closePath(), i.fill(), i.strokeStyle = "#666", i.fillStyle = this.is_entrance ? "#fff" : "#666", i.beginPath(), i.arc(this.cx, this.cy, .325 * t.grid_size, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.stroke()), i.strokeStyle = "#eee", i.lineWidth = 1, i.beginPath(), i.strokeRect(e, s, this.width, this.height), i.closePath(), i.stroke()
		},
		onEnter: function() {
			if (this.map.is_main_map && "build" == t.mode) 1 == this.build_flag ? (this.map.pre_building.show(), this.map.pre_building.locate(this)) : this.map.pre_building.hide();
			else if (this.map.is_main_map) {
				var i = "";
				this.is_entrance ? i = t._t("entrance") : this.is_exit ? i = t._t("exit") : 0 == this.passable_flag ? i = t._t("_cant_pass") : 0 == this.build_flag && (i = t._t("_cant_build")), i && this.scene.panel.balloontip.msg(i, this)
			}
		},
		onOut: function() {
			this.scene.panel.balloontip.el == this && this.scene.panel.balloontip.hide()
		},
		onClick: function() {
			1 == this.scene.state && ("build" == t.mode && this.map.is_main_map && !this.building ? this.checkBlock() ? this.scene.panel.balloontip.msg(this._block_msg, this) : this.buyBuilding(this.map.pre_building.type) : !this.building && this.map.selected_building && (this.map.selected_building.toggleSelected(), this.map.selected_building = null))
		}
	};
	t.Grid = function(e, s) {
		s.on_events = ["enter", "out", "click"];
		var n = new t.Element(e, s);
		return t.lang.mix(n, i), n._init(s), n
	}
});
 _TD.a.push(function(t) {
	var i = {
		_init: function(i) {
			this.is_selected = !1, this.level = 0, this.killed = 0, this.target = null, i = i || {}, this.map = i.map || null, this.grid = i.grid || null, this.bullet_type = i.bullet_type || 1, this.type = i.type, this.speed = i.speed, this.bullet_speed = i.bullet_speed, this.is_pre_building = !! i.is_pre_building, this.blink = this.is_pre_building, this.wait_blink = this._default_wait_blink = 20, this.is_weapon = "wall" != this.type;
			var e = t.getDefaultBuildingAttributes(this.type);
			t.lang.mix(this, e), this.range_px = this.range * t.grid_size, this.money = this.cost, this.caculatePos()
		},
		getUpgradeCost: function() {
			return Math.floor(.75 * this.money)
		},
		getSellMoney: function() {
			return Math.floor(.5 * this.money) || 1
		},
		toggleSelected: function() {
			this.is_selected = !this.is_selected, this.grid.hightLight(this.is_selected);
			var t = this;
			this.is_selected ? (this.map.eachBuilding(function(i) {
				i.is_selected = i == t
			}), (this.map.is_main_map ? this.scene.panel_map : this.scene.map).eachBuilding(function(t) {
				t.is_selected = !1, t.grid.hightLight(!1)
			}), this.map.selected_building = this, this.map.is_main_map ? this.scene.map.cancelPreBuild() : this.scene.map.preBuild(this.type)) : (this.map.selected_building == this && (this.map.selected_building = null), this.map.is_main_map || this.scene.map.cancelPreBuild()), this.map.is_main_map && (this.map.selected_building ? (this.scene.panel.btn_upgrade.show(), this.scene.panel.btn_sell.show(), this.updateBtnDesc()) : (this.scene.panel.btn_upgrade.hide(), this.scene.panel.btn_sell.hide()))
		},
		updateBtnDesc: function() {
			this.scene.panel.btn_upgrade.desc = t._t("upgrade", [t._t("building_name_" + this.type), this.level + 1, this.getUpgradeCost()]), this.scene.panel.btn_sell.desc = t._t("sell", [t._t("building_name_" + this.type), this.getSellMoney()])
		},
		locate: function(i) {
			this.grid = i, this.map = i.map, this.cx = this.grid.cx, this.cy = this.grid.cy, this.x = this.grid.x, this.y = this.grid.y, this.x2 = this.grid.x2, this.y2 = this.grid.y2, this.width = this.grid.width, this.height = this.grid.height, this.px = this.x + .5, this.py = this.y + .5, this.wait_blink = this._default_wait_blink, this._fire_wait = Math.floor(Math.max(2 / (this.speed * t.global_speed), 1)), this._fire_wait2 = this._fire_wait
		},
		remove: function() {
			this.grid && this.grid.building && this.grid.building == this && (this.grid.building = null), this.hide(), this.del()
		},
		findTaget: function() {
			if (this.is_weapon && !this.is_pre_building && this.grid) {
				var i = this.cx,
					e = this.cy,
					s = Math.pow(this.range_px, 2);
				this.target && this.target.is_valid && Math.pow(this.target.cx - i, 2) + Math.pow(this.target.cy - e, 2) <= s || (this.target = t.lang.any(t.lang.rndSort(this.map.monsters), function(t) {
					return Math.pow(t.cx - i, 2) + Math.pow(t.cy - e, 2) <= s
				}))
			}
		},
		getTargetPosition: function() {
			if (!this.target) {
				var t = this.map.is_main_map ? this.map.entrance : this.grid;
				return [t.cx, t.cy]
			}
			return [this.target.cx, this.target.cy]
		},
		fire: function() {
			if (this.target && this.target.is_valid) {
				if ("laser_gun" == this.type) return void this.target.beHit(this, this.damage);
				var i = this.muzzle || [this.cx, this.cy],
					e = i[0],
					s = i[1];
				new t.Bullet(null, {
					building: this,
					damage: this.damage,
					target: this.target,
					speed: this.bullet_speed,
					x: e,
					y: s
				})
			}
		},
		tryToFire: function() {
			this.is_weapon && this.target && (this._fire_wait--, this._fire_wait > 0 || (this._fire_wait < 0 ? this._fire_wait = this._fire_wait2 : this.fire()))
		},
		_upgrade2: function(i) {
			this._upgrade_records[i] || (this._upgrade_records[i] = this[i]);
			var e = this._upgrade_records[i],
				s = "max_" + i,
				n = "_upgrade_rule_" + i,
				h = this[n] || t.default_upgrade_rule;
			e && !isNaN(e) && (e = h(this.level, e), this[s] && !isNaN(this[s]) && this[s] < e && (e = this[s]), this._upgrade_records[i] = e, this[i] = Math.floor(e))
		},
		upgrade: function() {
			this._upgrade_records || (this._upgrade_records = {});
			var i, e = ["damage", "range", "speed", "life", "shield"],
				s = e.length;
			for (i = 0; s > i; i++) this._upgrade2(e[i]);
			this.level++, this.range_px = this.range * t.grid_size
		},
		tryToUpgrade: function(i) {
			var e = this.getUpgradeCost(),
				s = "";
			e > t.money ? s = t._t("not_enough_money", [e]) : (t.money -= e, this.money += e, this.upgrade(), s = t._t("upgrade_success", [t._t("building_name_" + this.type), this.level, this.getUpgradeCost()])), this.updateBtnDesc(), this.scene.panel.balloontip.msg(s, i)
		},
		tryToSell: function() {
			this.is_valid && (t.money += this.getSellMoney(), this.grid.removeBuilding(), this.is_valid = !1, this.map.selected_building = null, this.map.select_hl.hide(), this.map.checkHasWeapon(), this.scene.panel.btn_upgrade.hide(), this.scene.panel.btn_sell.hide(), this.scene.panel.balloontip.hide())
		},
		step: function() {
			this.blink && (this.wait_blink--, this.wait_blink < -this._default_wait_blink && (this.wait_blink = this._default_wait_blink)), this.findTaget(), this.tryToFire()
		},
		render: function() {
			if (this.is_visiable && !(this.wait_blink < 0)) {
				var i = t.ctx;
				t.renderBuilding(this), this.map.is_main_map && (this.is_selected || this.is_pre_building || this.map.show_all_ranges) && this.is_weapon && this.range > 0 && this.grid && (i.lineWidth = _TD.retina, i.fillStyle = "rgba(187, 141, 32, 0.15)", i.strokeStyle = "#bb8d20", i.beginPath(), i.arc(this.cx, this.cy, this.range_px, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.stroke()), "laser_gun" == this.type && this.target && this.target.is_valid && (i.lineWidth = 3 * _TD.retina, i.strokeStyle = "rgba(50, 50, 200, 0.5)", i.beginPath(), i.moveTo(this.cx, this.cy), i.lineTo(this.target.cx, this.target.cy), i.closePath(), i.stroke(), i.lineWidth = _TD.retina, i.strokeStyle = "rgba(150, 150, 255, 0.5)", i.beginPath(), i.lineTo(this.cx, this.cy), i.closePath(), i.stroke())
			}
		},
		onEnter: function() {
			if (!this.is_pre_building) {
				var i = "建筑工事";
				i = this.map.is_main_map ? t._t("building_info" + ("wall" == this.type ? "_wall" : ""), [t._t("building_name_" + this.type), this.level, this.damage, this.speed, this.range, this.killed]) : t._t("building_intro_" + this.type, [t.getDefaultBuildingAttributes(this.type).cost]), this.scene.panel.balloontip.msg(i, this.grid)
			}
		},
		onOut: function() {
			this.scene.panel.balloontip.el == this.grid && this.scene.panel.balloontip.hide()
		},
		onClick: function() {
			this.is_pre_building || 1 != this.scene.state || this.toggleSelected()
		}
	};
	t.Building = function(e, s) {
		s.on_events = ["enter", "out", "click"];
		var n = new t.Element(e, s);
		return t.lang.mix(n, i), n._init(s), n
	};
	var e = {
		_init: function(t) {
			t = t || {}, this.speed = t.speed, this.damage = t.damage, this.target = t.target, this.cx = t.x, this.cy = t.y, this.r = t.r || Math.max(Math.log(this.damage), 2), this.r < 1 && (this.r = 1), this.r > 6 && (this.r = 6), this.building = t.building || null, this.map = t.map || this.building.map, this.type = t.type || 1, this.color = t.color || "#000", this.map.bullets.push(this), this.addToScene(this.map.scene, 1, 6), 1 == this.type && this.caculate()
		},
		caculate: function() {
			var i, e, s, n, h = this.target.cx,
				a = this.target.cy;
			i = h - this.cx, e = a - this.cy, s = Math.sqrt(Math.pow(i, 2) + Math.pow(e, 2)), n = 20 * this.speed * t.global_speed, this.vx = i * n / s, this.vy = e * n / s
		},
		checkOutOfMap: function() {
			return this.is_valid = !(this.cx < this.map.x || this.cx > this.map.x2 || this.cy < this.map.y || this.cy > this.map.y2), !this.is_valid
		},
		checkHit: function() {
			var i = this.cx,
				e = this.cy,
				s = this.r * _TD.retina,
				n = this.map.anyMonster(function(t) {
					return Math.pow(t.cx - i, 2) + Math.pow(t.cy - e, 2) <= 2 * Math.pow(t.r + s, 2)
				});
			return n ? (n.beHit(this.building, this.damage), this.is_valid = !1, t.Explode(this.id + "-explode", {
				cx: this.cx,
				cy: this.cy,
				r: this.r,
				step_level: this.step_level,
				render_level: this.render_level,
				color: this.color,
				scene: this.map.scene,
				time: .2
			}), !0) : !1
		},
		step: function() {
			this.checkOutOfMap() || this.checkHit() || (this.cx += this.vx, this.cy += this.vy)
		},
		render: function() {
			var i = t.ctx;
			i.fillStyle = this.color, i.beginPath(), i.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI, !0), i.closePath(), i.fill()
		}
	};
	t.Bullet = function(i, s) {
		var n = new t.Element(i, s);
		return t.lang.mix(n, e), n._init(s), n
	}
});
_TD.a.push(function(t) {
	var i = {
		_init: function(i) {
			i = i || {}, this.is_monster = !0, this.idx = i.idx || 1, this.difficulty = i.difficulty || 1;
			var e = t.getDefaultMonsterAttributes(this.idx);
			this.speed = Math.floor((e.speed + this.difficulty / 2) * (.5 * Math.random() + .75)), this.speed < 1 && (this.speed = 1), this.speed > i.max_speed && (this.speed = i.max_speed), this.life = this.life0 = Math.floor(e.life * (this.difficulty + 1) * (Math.random() + .5) * .5), this.life < 1 && (this.life = this.life0 = 1), this.shield = Math.floor(e.shield + this.difficulty / 2), this.shield < 0 && (this.shield = 0), this.damage = Math.floor((e.damage || 1) * (.5 * Math.random() + .75)), this.damage < 1 && (this.damage = 1), this.money = e.money || Math.floor(Math.sqrt((this.speed + this.life) * (this.shield + 1) * this.damage)), this.money < 1 && (this.money = 1), this.color = e.color || t.lang.rndRGB(), this.r = Math.floor(1.2 * this.damage) * _TD.retina, this.r < 4 * _TD.retina && (this.r = 4 * _TD.retina), this.r > t.grid_size / 2 - 4 * _TD.retina && (this.r = t.grid_size / 2 - 4 * _TD.retina), this.render = e.render, this.grid = null, this.map = null, this.next_grid = null, this.way = [], this.toward = 2, this._dx = 0, this._dy = 0, this.is_blocked = !1
		},
		caculatePos: function() {
			var t = this.r;
			this.x = this.cx - t, this.y = this.cy - t, this.x2 = this.cx + t, this.y2 = this.cy + t
		},
		beHit: function(i, e) {
			if (this.is_valid) {
				var s = Math.ceil(.1 * e);
				e -= this.shield, s >= e && (e = s), this.life -= e, t.score += Math.floor(Math.sqrt(e)), this.life <= 0 && this.beKilled(i);
				var n = this.scene.panel.balloontip;
				n.el == this && (n.text = t._t("monster_info", [this.life, this.shield, this.speed, this.damage]))
			}
		},
		beKilled: function(i) {
			this.is_valid && (this.life = 0, this.is_valid = !1, t.money += this.money, i.killed++, t.Explode(this.id + "-explode", {
				cx: this.cx,
				cy: this.cy,
				color: this.color,
				r: this.r,
				step_level: this.step_level,
				render_level: this.render_level,
				scene: this.grid.scene
			}))
		},
		arrive: function() {
			this.grid = this.next_grid, this.next_grid = null, this.checkFinish()
		},
		findWay: function() {
			var i = this,
				e = new t.FindWay(this.map.grid_x, this.map.grid_y, this.grid.mx, this.grid.my, this.map.exit.mx, this.map.exit.my, function(t, e) {
					return i.map.checkPassable(t, e)
				});
			this.way = e.way
		},
		checkFinish: function() {
			this.grid && this.map && this.grid == this.map.exit && (t.life -= this.damage, t.wave_damage += this.damage, t.life <= 0 ? (t.life = 0, t.stage.gameover()) : (this.pause(), this.del()))
		},
		beAddToGrid: function(t) {
			this.grid = t, this.map = t.map, this.cx = t.cx, this.cy = t.cy, this.grid.scene.addElement(this)
		},
		getToward: function() {
			this.grid && this.next_grid && (this.grid.my < this.next_grid.my ? this.toward = 0 : this.grid.mx < this.next_grid.mx ? this.toward = 1 : this.grid.my > this.next_grid.my ? this.toward = 2 : this.grid.mx > this.next_grid.mx && (this.toward = 3))
		},
		getNextGrid: function() {
			(0 == this.way.length || Math.random() < .1) && this.findWay();
			var t = this.way.shift();
			t && !this.map.checkPassable(t[0], t[1]) && (this.findWay(), t = this.way.shift()), t && (this.next_grid = this.map.getGrid(t[0], t[1]))
		},
		chkIfBlocked: function(i, e) {
			var s = this,
				n = new t.FindWay(this.map.grid_x, this.map.grid_y, this.grid.mx, this.grid.my, this.map.exit.mx, this.map.exit.my, function(t, n) {
					return !(t == i && n == e) && s.map.checkPassable(t, n)
				});
			return n.is_blocked
		},
		beBlocked: function() {
			this.is_blocked || (this.is_blocked = !0, t.log("monster be blocked!"))
		},
		step: function() {
			if (this.is_valid && !this.is_paused && this.grid) {
				if (!this.next_grid && (this.getNextGrid(), !this.next_grid)) return void this.beBlocked();
				if (this.cx == this.next_grid.cx && this.cy == this.next_grid.cy) this.arrive();
				else {
					var i = this.next_grid.cx - this.cx,
						e = this.next_grid.cy - this.cy,
						s = 0 > i ? -1 : 1,
						n = 0 > e ? -1 : 1,
						h = this.speed * t.global_speed;
					Math.abs(i) < h && Math.abs(e) < h ? (this.cx = this.next_grid.cx, this.cy = this.next_grid.cy, this._dx = h - Math.abs(i), this._dy = h - Math.abs(e)) : (this.cx += 0 == i ? 0 : s * (h + this._dx), this.cy += 0 == e ? 0 : n * (h + this._dy), this._dx = 0, this._dy = 0)
				}
				this.caculatePos()
			}
		},
		onEnter: function() {
			var i, e = this.scene.panel.balloontip;
			e.el == this ? (e.hide(), e.el = null) : (i = t._t("monster_info", [this.life, this.shield, this.speed, this.damage]), e.msg(i, this))
		},
		onOut: function() {}
	};
	t.Monster = function(e, s) {
		s.on_events = ["enter", "out"];
		var n = new t.Element(e, s);
		return t.lang.mix(n, i), n._init(s), n
	};
	var e = {
		_init: function(i) {
			i = i || {};
			var e = t.lang.rgb2Arr(i.color);
			this.cx = i.cx, this.cy = i.cy, this.r = i.r * _TD.retina, this.step_level = i.step_level, this.render_level = i.render_level, this.rgb_r = e[0], this.rgb_g = e[1], this.rgb_b = e[2], this.rgb_a = 1, this.wait = this.wait0 = t.exp_fps * (i.time || 1), i.scene.addElement(this)
		},
		step: function() {
			this.is_valid && (this.wait--, this.r++, this.is_valid = this.wait > 0, this.rgb_a = this.wait / this.wait0)
		},
		render: function() {
			var i = t.ctx;
			i.fillStyle = "rgba(" + this.rgb_r + "," + this.rgb_g + "," + this.rgb_b + "," + this.rgb_a + ")", i.beginPath(), i.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI, !0), i.closePath(), i.fill()
		}
	};
	t.Explode = function(i, s) {
		var n = new t.Element(i, s);
		return t.lang.mix(n, e), n._init(s), n
	}
});
 _TD.a.push(function(t) {
	var i = {
		_init: function(i) {
			i = i || {}, this.x = i.x, this.y = i.y, this.scene = i.scene, this.map = i.main_map;
			var e = new t.Map("panel-map", t.lang.mix({
				x: this.x + i.map.x,
				y: this.y + i.map.y,
				scene: this.scene,
				step_level: this.step_level,
				render_level: this.render_level
			}, i.map, !1));
			this.addToScene(this.scene, 1, 7), e.addToScene(this.scene, 1, 7, e.grids), this.scene.panel_map = e, this.gameover_obj = new t.GameOver("panel-gameover", {
				panel: this,
				scene: this.scene,
				step_level: this.step_level,
				is_visiable: !1,
				x: 0,
				y: 0,
				width: this.scene.stage.width,
				height: this.scene.stage.height,
				render_level: 9
			}), this.balloontip = new t.BalloonTip("panel-balloon-tip", {
				scene: this.scene,
				step_level: this.step_level,
				render_level: 9
			}), this.balloontip.addToScene(this.scene, 1, 9), this.btn_pause = new t.Button("panel-btn-pause", {
				scene: this.scene,
				x: this.x,
				y: this.y + 260 * _TD.retina,
				text: t._t("button_pause_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function() {
					1 == this.scene.state ? (this.scene.pause(), this.text = t._t("button_continue_text"), this.scene.panel.btn_upgrade.hide(), this.scene.panel.btn_sell.hide(), this.scene.panel.btn_restart.show()) : 2 == this.scene.state && (this.scene.start(), this.text = t._t("button_pause_text"), this.scene.panel.btn_restart.hide(), this.scene.map.selected_building && (this.scene.panel.btn_upgrade.show(), this.scene.panel.btn_sell.show()))
				}
			}), this.btn_restart = new t.Button("panel-btn-restart", {
				scene: this.scene,
				x: this.x,
				y: this.y + 300 * _TD.retina,
				is_visiable: !1,
				text: t._t("button_restart_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function() {
					setTimeout(function() {
						t.stage.clear(), t.is_paused = !0, t.start(), t.mouseHand(!1)
					}, 0)
				}
			}), this.btn_upgrade = new t.Button("panel-btn-upgrade", {
				scene: this.scene,
				x: this.x,
				y: this.y + 300 * _TD.retina,
				is_visiable: !1,
				text: t._t("button_upgrade_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function() {
					this.scene.map.selected_building.tryToUpgrade(this)
				}
			}), this.btn_sell = new t.Button("panel-btn-sell", {
				scene: this.scene,
				x: this.x,
				y: this.y + 340 * _TD.retina,
				is_visiable: !1,
				text: t._t("button_sell_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function() {
					this.scene.map.selected_building.tryToSell(this)
				}
			})
		},
		step: function() {
			t.life_recover && (this._life_recover = this._life_recover2 = t.life_recover, this._life_recover_wait = this._life_recover_wait2 = 3 * t.exp_fps, t.life_recover = 0), this._life_recover && t.iframe % t.exp_fps_eighth == 0 && (t.life++, this._life_recover--)
		},
		render: function() {
			var i = t.ctx;
			if (i.textAlign = "left", i.textBaseline = "top", i.fillStyle = "#000", i.font = "normal " + 12 * _TD.retina + "px 'Courier New'", i.beginPath(), i.fillText(t._t("panel_money_title") + t.money, this.x, this.y), i.fillText(t._t("panel_score_title") + t.score, this.x, this.y + 20 * _TD.retina), i.fillText(t._t("panel_life_title") + t.life, this.x, this.y + 40 * _TD.retina), i.fillText(t._t("panel_building_title") + this.map.buildings.length, this.x, this.y + 60 * _TD.retina), i.fillText(t._t("panel_monster_title") + this.map.monsters.length, this.x, this.y + 80 * _TD.retina), i.fillText(t._t("wave_info", [this.scene.wave]), this.x, this.y + 210 * _TD.retina), i.closePath(), this._life_recover_wait) {
				var e = this._life_recover_wait / this._life_recover_wait2;
				i.fillStyle = "rgba(255, 0, 0, " + e + ")", i.font = "bold " + 12 * _TD.retina + "px 'Verdana'", i.beginPath(), i.fillText("+" + this._life_recover2, this.x + 60 * _TD.retina, this.y + 40 * _TD.retina), i.closePath(), this._life_recover_wait--
			}
			i.textAlign = "right", i.fillStyle = "#666", i.font = "normal " + 12 * _TD.retina + "px 'Courier New'", i.beginPath(), i.fillText("version: " + t.version + " | " + "t" + "a" + "f" + "a" + "n" + "g." + "or" + "g." + "cn", t.stage.width - t.padding, t.stage.height - 2 * t.padding), i.closePath(), i.textAlign = "left", i.fillStyle = "#666", i.font = "normal " + 12 * _TD.retina + "px 'Courier New'", i.beginPath(), i.fillText("FPS: " + t.fps, t.padding, t.stage.height - 2 * t.padding), i.closePath()
		}
	};
	t.Panel = function(e, s) {
		var n = new t.Element(e, s);
		return t.lang.mix(n, i), n._init(s), n
	};
	var e = {
		_init: function(t) {
			t = t || {}, this.scene = t.scene
		},
		caculatePos: function() {
			var i = this.el;
			this.x = i.cx + .5, this.y = i.cy + .5, this.x + this.width > this.scene.stage.width - t.padding && (this.x = this.x - this.width), this.px = this.x + 5 * _TD.retina, this.py = this.y + 4 * _TD.retina
		},
		msg: function(i, e) {
			this.text = i;
			var s = t.ctx;
			s.font = "normal " + 12 * _TD.retina + "px 'Courier New'", this.width = Math.max(s.measureText(i).width + 10 * _TD.retina, 6 * t.lang.strLen2(i) + 10 * _TD.retina), this.height = 20 * _TD.retina, e && e.cx && e.cy && (this.el = e, this.caculatePos(), this.show())
		},
		step: function() {
			return this.el && this.el.is_valid ? void(this.el.is_monster && this.caculatePos()) : void this.hide()
		},
		render: function() {
			if (this.el) {
				var i = t.ctx;
				i.lineWidth = _TD.retina, i.fillStyle = "rgba(255, 255, 0, 0.5)", i.strokeStyle = "rgba(222, 222, 0, 0.9)", i.beginPath(), i.rect(this.x, this.y, this.width, this.height), i.closePath(), i.fill(), i.stroke(), i.textAlign = "left", i.textBaseline = "top", i.fillStyle = "#000", i.font = "normal " + 12 * _TD.retina + "px 'Courier New'", i.beginPath(), i.fillText(this.text, this.px, this.py), i.closePath()
			}
		}
	};
	t.BalloonTip = function(i, s) {
		var n = new t.Element(i, s);
		return t.lang.mix(n, e), n._init(s), n
	};
	var s = {
		_init: function(i) {
			i = i || {}, this.text = i.text, this.onClick = i.onClick || t.lang.nullFunc, this.x = i.x, this.y = i.y, this.width = i.width || 80 * _TD.retina, this.height = i.height || 30 * _TD.retina, this.font_x = this.x + 8 * _TD.retina, this.font_y = this.y + 9 * _TD.retina, this.scene = i.scene, this.desc = i.desc || "", this.addToScene(this.scene, this.step_level, this.render_level), this.caculatePos()
		},
		onEnter: function() {
			t.mouseHand(!0), this.desc && this.scene.panel.balloontip.msg(this.desc, this)
		},
		onOut: function() {
			t.mouseHand(!1), this.scene.panel.balloontip.el == this && this.scene.panel.balloontip.hide()
		},
		render: function() {
			var i = t.ctx;
			i.lineWidth = 2 * _TD.retina, i.fillStyle = this.is_hover ? "#eee" : "#ccc", i.strokeStyle = "#999", i.beginPath(), i.rect(this.x, this.y, this.width, this.height), i.closePath(), i.fill(), i.stroke(), i.textAlign = "left", i.textBaseline = "top", i.fillStyle = "#000", i.font = "normal " + 12 * _TD.retina + "px 'Courier New'", i.beginPath(), i.fillText(this.text, this.font_x, this.font_y), i.closePath(), i.fill()
		}
	};
	t.Button = function(i, e) {
		e.on_events = ["enter", "out", "click"];
		var n = new t.Element(i, e);
		return t.lang.mix(n, s), n._init(e), n
	};
	var n = {
		_init: function(t) {
			this.panel = t.panel, this.scene = t.scene, this.addToScene(this.scene, 1, 9)
		},
		render: function() {
			this.panel.btn_pause.hide(), this.panel.btn_upgrade.hide(), this.panel.btn_sell.hide(), this.panel.btn_restart.show();
			var i = t.ctx;
			i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = "#ccc", i.font = "bold 62px 'Verdana'", i.beginPath(), i.fillText("GAME OVER", this.width / 2, this.height / 2), i.closePath(), i.fillStyle = "#f00", i.font = "bold 60px 'Verdana'", i.beginPath(), i.fillText("GAME OVER", this.width / 2, this.height / 2), i.closePath()
		}
	};
	t.GameOver = function(i, e) {
		var s = new t.Element(i, e);
		return t.lang.mix(s, n), s._init(e), s
	}, t.recover = function(i) {
		t.life_recover = i, t.log("life recover: " + i)
	}
});
 _TD.a.push(function(t) {
	var i = function() {
			var i = new t.Act(this, "act-1"),
				e = new t.Scene(i, "scene-1"),
				s = t.getDefaultStageData("scene_endless");
			this.config = s.config, t.life = this.config.life, t.money = this.config.money, t.score = this.config.score, t.difficulty = this.config.difficulty, t.wave_damage = this.config.wave_damage;
			var n = new t.Map("main-map", t.lang.mix({
				scene: e,
				is_main_map: !0,
				step_level: 1,
				render_level: 2
			}, s.map));
			n.addToScene(e, 1, 2, n.grids), e.map = n, e.panel = new t.Panel("panel", t.lang.mix({
				scene: e,
				main_map: n,
				step_level: 1,
				render_level: 7
			}, s.panel)), this.newWave = s.newWave, this.map = n, this.wait_new_wave = this.config.wait_new_wave
		},
		e = function() {
			var i = this.current_act.current_scene,
				e = i.wave;
			if ((0 != e || this.map.has_weapon) && 1 == i.state && 0 == this.map.monsters.length) {
				if (e > 0 && this.wait_new_wave == this.config.wait_new_wave - 1) {
					var s = 0;
					e % 10 == 0 ? s = 10 : e % 5 == 0 && (s = 5), t.life + s > 100 && (s = 100 - t.life), s > 0 && t.recover(s)
				}
				if (this.wait_new_wave > 0) return void this.wait_new_wave--;
				this.wait_new_wave = this.config.wait_new_wave, e++, i.wave = e, this.newWave({
					map: this.map,
					wave: e
				})
			}
		};
	t.getDefaultStageData = function(s) {
		var n = {
			stage_main: {
				width: 640 * _TD.retina,
				height: 560 * _TD.retina,
				init: i,
				step2: e
			},
			scene_endless: {
				map: {
					grid_x: 16,
					grid_y: 16,
					x: t.padding,
					y: t.padding,
					entrance: [0, 0],
					exit: [15, 15],
					grids_cfg: [{
						pos: [3, 3],
						passable_flag: 0
					}, {
						pos: [7, 15],
						build_flag: 0
					}, {
						pos: [4, 12],
						building: "wall"
					}, {
						pos: [4, 13],
						building: "wall"
					}]
        },
        // 仪表板
				panel: {
					x: 2 * t.padding + 16 * t.grid_size,
					y: t.padding,
					map: {
						grid_x: 3,
						grid_y: 3,
						x: 0,
						y: 110 * _TD.retina,
						grids_cfg: [{
							pos: [0, 0],
							building: "cannon"
						}, {
							pos: [1, 0],
							building: "LMG"
						}, {
							pos: [2, 0],
							building: "HMG"
						}, {
							pos: [0, 1],
							building: "laser_gun"
						}, {
							pos: [2, 2],
							building: "wall"
						}]
					}
        },
        // 配置
				config: {
					endless: !0,  // 连续
					wait_new_wave: 3 * t.exp_fps,
					difficulty: 1, // 难度
					wave: 0,
					max_wave: -1,
					wave_damage: 0,
					max_monsters_per_wave: 100,
					money: 500000,// 钱
					score: 0,  // 分数
					life: 50000, // 生命
					waves: [   // 波浪
						[],
						[
							[1, 0]
						],
						[
							[1, 0],
							[1, 1]
						],
						[
							[2, 0],
							[1, 1]
						],
						[
							[2, 0],
							[1, 1]
						],
						[
							[3, 0],
							[2, 1]
						],
						[
							[4, 0],
							[2, 1]
						],
						[
							[5, 0],
							[3, 1],
							[1, 2]
						],
						[
							[6, 0],
							[4, 1],
							[1, 2]
						],
						[
							[7, 0],
							[3, 1],
							[2, 2]
						],
						[
							[8, 0],
							[4, 1],
							[3, 2]
						]
					]
				},
				newWave: function(i) {
					i = i || {};
					var e = i.map,
						s = i.wave || 1,
						n = t.wave_damage || 0;
					1 == s || (0 == n ? 5 > s ? t.difficulty *= 1.05 : t.difficulty > 30 ? t.difficulty *= 1.1 : t.difficulty *= 1.2 : t.wave_damage >= 50 ? t.difficulty *= .6 : t.wave_damage >= 30 ? t.difficulty *= .7 : t.wave_damage >= 20 ? t.difficulty *= .8 : t.wave_damage >= 10 ? t.difficulty *= .9 : s >= 10 && (t.difficulty *= 1.05)), t.difficulty < 1 && (t.difficulty = 1), t.log("wave " + s + ", last wave damage = " + n + ", difficulty = " + t.difficulty);
					var h = this.config.waves[s] || t.makeMonsters(Math.min(Math.floor(Math.pow(s, 1.1)), this.config.max_monsters_per_wave));
					e.addMonsters2(h), t.wave_damage = 0
				}
			}
		};
		return n[s] || {}
	}
});
 _TD.a.push(function(t) {
	t.default_upgrade_rule = function(t, i) {
		return 1.2 * i
	}, t.getDefaultBuildingAttributes = function(t) {
    // 获取默认建筑属性
		var i = {
			wall: {  // 墙
				damage: 0,
				range: 0,
				speed: 0,
				bullet_speed: 0,
				life: 100,
				shield: 500,
				cost: 5
			},
			cannon: { // 小型炮
				damage: 12,   // 伤害
				range: 4,     // 范围
				max_range: 8, // 最大范围
				speed: 2,     // 速度
				bullet_speed: 6,// 子弹速度
				life: 100,      // 生命
				shield: 100,    // 防御
				cost: 300,      // 价值
				_upgrade_rule_damage: function(t, i) {  // 伤害升级规则
					return i * (10 >= t ? 1.2 : 1.3)
				}
			},
			LMG: {  // 轻机枪
				damage: 5,
				range: 5,
				max_range: 10,
				speed: 3,
				bullet_speed: 6,
				life: 100,
				shield: 50,
				cost: 100
			},
			HMG: {   // 大炮
				damage: 50,
				range: 4,
				max_range: 10,
				speed: 5,
				bullet_speed: 10,
				life: 100,
				shield: 200,
				cost: 800,
				_upgrade_rule_damage: function(t, i) {
					return 1.3 * i
				}
			},
			laser_gun: { // 激光
				damage: 99999,
				range: 20,
				max_range: 30,
				speed: 300,
				life: 100,
				shield: 100,
				cost: 2e3
			}
		};
		return i[t] || {}
	}
});
 _TD.a.push(function(t) {
	function i() {
		if (this.is_valid && this.grid) {
			var i = t.ctx;
			if (i.strokeStyle = "#000", i.lineWidth = 1, i.fillStyle = this.color, i.beginPath(), i.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.stroke(), t.show_monster_life) {
				var e = Math.floor(t.grid_size / 4),
					s = 2 * e - 2 * _TD.retina;
				i.fillStyle = "#000", i.beginPath(), i.fillRect(this.cx - e, this.cy - this.r - 6, 2 * e, 4 * _TD.retina), i.closePath(), i.fillStyle = "#f00", i.beginPath(), i.fillRect(this.cx - e + _TD.retina, this.cy - this.r - (6 - _TD.retina), this.life * s / this.life0, 2 * _TD.retina), i.closePath()
			}
		}
  }
  // 获取怪兽默认属性
	t.getDefaultMonsterAttributes = function(e) {
		var s = [{
			name: "monster 1",
			desc: "最弱小的怪物",
			speed: 3,
			max_speed: 10,
			life: 50,
			damage: 1,
			shield: 0,
			money: 5
		}, {
			name: "monster 2",
			desc: "稍强一些的小怪",
			speed: 6,
			max_speed: 20,
			life: 50,
			damage: 2,
			shield: 1
		}, {
			name: "monster speed",
			desc: "速度较快的小怪",
			speed: 12,
			max_speed: 30,
			life: 50,
			damage: 3,
			shield: 1
		}, {
			name: "monster life",
			desc: "生命值很强的小怪",
			speed: 5,
			max_speed: 10,
			life: 500,
			damage: 3,
			shield: 1
		}, {
			name: "monster shield",
			desc: "防御很强的小怪",
			speed: 5,
			max_speed: 10,
			life: 50,
			damage: 3,
			shield: 20
		}, {
			name: "monster damage",
			desc: "伤害值很大的小怪",
			speed: 7,
			max_speed: 14,
			life: 50,
			damage: 10,
			shield: 2
		}, {
			name: "monster speed-life",
			desc: "速度、生命都较高的怪物",
			speed: 15,
			max_speed: 30,
			life: 100,
			damage: 3,
			shield: 3
		}, {
			name: "monster speed-2",
			desc: "速度很快的怪物",
			speed: 30,
			max_speed: 40,
			life: 30,
			damage: 4,
			shield: 1
		}, {
			name: "monster shield-life",
			desc: "防御很强、生命值很高的怪物",
			speed: 3,
			max_speed: 10,
			life: 300,
			damage: 5,
			shield: 15
		}];
		if ("undefined" == typeof e) return s.length;
		var n = s[e] || s[0],
			h = {};
		return t.lang.mix(h, n), h.render || (h.render = i), h
	}, t.makeMonsters = function(i, e) {
		var s, n, h, a, l = [],
			r = 0,
			c = t.monster_type_count;
		if (!e) for (e = [], s = 0; c > s; s++) e.push(s);
		for (; i > r;) h = i - r, n = Math.min(Math.floor(Math.random() * h) + 1, 3), a = Math.floor(Math.random() * c), l.push([n, e[a]]), r += n;
		return l
	}
});
 _TD.a.push(function(t) {
	function i(t, i, e, s, n, h) {
		var a, l, r, c, o, _, d, u, g;
		if (i == s) a = i, l = n > e ? e + h : e - h;
		else if (e == n) l = e, a = s > i ? i + h : i - h;
		else {
			if (r = (e - n) / (i - s), c = e - i * r, d = r * r + 1, u = 2 * (r * (c - e) - i), g = Math.pow(c - e, 2) + i * i - Math.pow(h, 2), o = Math.pow(u, 2) - 4 * d * g, 0 > o) return [0, 0];
			o = Math.sqrt(o), _ = (-u + o) / (2 * d), s - i > 0 && _ - i > 0 || 0 > s - i && 0 > _ - i ? (a = _, l = r * a + c) : (a = (-u - o) / (2 * d), l = r * a + c)
		}
		return t.lineCap = "round", t.moveTo(i, e), t.lineTo(a, l), [a, l]
	}
	var e = {
		cannon: function(t, e, s, n, h) {
			var a = t.getTargetPosition();
			e.fillStyle = "#393", e.strokeStyle = "#000", e.beginPath(), e.lineWidth = _TD.retina, e.arc(t.cx, t.cy, h - 5, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.stroke(), e.lineWidth = 3 * _TD.retina, e.beginPath(), e.moveTo(t.cx, t.cy), t.muzzle = i(e, t.cx, t.cy, a[0], a[1], h), e.closePath(), e.stroke(), e.lineWidth = _TD.retina, e.fillStyle = "#060", e.beginPath(), e.arc(t.cx, t.cy, 7 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.stroke(), e.fillStyle = "#cec", e.beginPath(), e.arc(t.cx + 2, t.cy - 2, 3 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill()
		},
		LMG: function(t, e, s, n, h) {
			var a = t.getTargetPosition();
			e.fillStyle = "#36f", e.strokeStyle = "#000", e.beginPath(), e.lineWidth = _TD.retina, e.arc(t.cx, t.cy, 7 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.stroke(), e.lineWidth = 2 * _TD.retina, e.beginPath(), e.moveTo(t.cx, t.cy), t.muzzle = i(e, t.cx, t.cy, a[0], a[1], h), e.closePath(), e.fill(), e.stroke(), e.lineWidth = _TD.retina, e.fillStyle = "#66c", e.beginPath(), e.arc(t.cx, t.cy, 5 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.stroke(), e.fillStyle = "#ccf", e.beginPath(), e.arc(t.cx + 1, t.cy - 1, 2 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill()
		},
		HMG: function(t, e, s, n, h) {
			var a = t.getTargetPosition();
			e.fillStyle = "#933", e.strokeStyle = "#000", e.beginPath(), e.lineWidth = _TD.retina, e.arc(t.cx, t.cy, h - 2, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.stroke(), e.lineWidth = 5 * _TD.retina, e.beginPath(), e.moveTo(t.cx, t.cy), t.muzzle = i(e, t.cx, t.cy, a[0], a[1], h), e.closePath(), e.fill(), e.stroke(), e.lineWidth = _TD.retina, e.fillStyle = "#630", e.beginPath(), e.arc(t.cx, t.cy, h - 5 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.stroke(), e.fillStyle = "#960", e.beginPath(), e.arc(t.cx + 1, t.cy - 1, 8 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.fillStyle = "#fcc", e.beginPath(), e.arc(t.cx + 3, t.cy - 3, 4 * _TD.retina, 0, 2 * Math.PI, !0), e.closePath(), e.fill()
		},
		wall: function(t, i, e, s, n) {
			i.lineWidth = _TD.retina, i.fillStyle = "#666", i.strokeStyle = "#000", i.fillRect(t.cx - n + 1, t.cy - n + 1, s - 1, s - 1), i.beginPath(), i.moveTo(t.cx - n + .5, t.cy - n + .5), i.lineTo(t.cx - n + .5, t.cy + n + .5), i.lineTo(t.cx + n + .5, t.cy + n + .5), i.lineTo(t.cx + n + .5, t.cy - n + .5), i.lineTo(t.cx - n + .5, t.cy - n + .5), i.moveTo(t.cx - n + .5, t.cy + n + .5), i.lineTo(t.cx + n + .5, t.cy - n + .5), i.moveTo(t.cx - n + .5, t.cy - n + .5), i.lineTo(t.cx + n + .5, t.cy + n + .5), i.closePath(), i.stroke()
		},
		laser_gun: function(t, i) {
			i.fillStyle = "#f00", i.strokeStyle = "#000", i.beginPath(), i.lineWidth = _TD.retina, i.moveTo(t.cx, t.cy - 10 * _TD.retina), i.lineTo(t.cx - 8.66 * _TD.retina, t.cy + 5 * _TD.retina), i.lineTo(t.cx + 8.66 * _TD.retina, t.cy + 5 * _TD.retina), i.lineTo(t.cx, t.cy - 10 * _TD.retina), i.closePath(), i.fill(), i.stroke(), i.fillStyle = "#60f", i.beginPath(), i.arc(t.cx, t.cy, 7 * _TD.retina, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.stroke(), i.fillStyle = "#000", i.beginPath(), i.arc(t.cx, t.cy, 3 * _TD.retina, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.fillStyle = "#666", i.beginPath(), i.arc(t.cx + 1, t.cy - 1, _TD.retina, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.lineWidth = 3 * _TD.retina, i.beginPath(), i.moveTo(t.cx, t.cy), i.closePath(), i.fill(), i.stroke()
		}
	};
	t.renderBuilding = function(i) {
		var s = t.ctx,
			n = i.map,
			h = t.grid_size,
			a = t.grid_size / 2;
		(e[i.type] || e.wall)(i, s, n, h, a)
	}
});
 _TD.a.push(function(t) {
	t._msg_texts = {
		_cant_build: "不能在这儿修建",
		_cant_pass: "怪物不能通过这儿",
		entrance: "起点",
		exit: "终点",
		not_enough_money: "金钱不足，需要 $${0}！",
		wave_info: "第 ${0} 波",
		panel_money_title: "金钱: ",
		panel_score_title: "积分: ",
		panel_life_title: "生命: ",
		panel_building_title: "建筑: ",
		panel_monster_title: "怪物: ",
		building_name_wall: "路障",
		building_name_cannon: "炮台",
		building_name_LMG: "轻机枪",
		building_name_HMG: "重机枪",
		building_name_laser_gun: "激光炮",
		building_info: "${0}: 等级 ${1}，攻击 ${2}，速度 ${3}，射程 ${4}，战绩 ${5}",
		building_info_wall: "${0}",
		building_intro_wall: "路障 可以阻止怪物通过 ($${0})",
		building_intro_cannon: "炮台 射程、杀伤力较为平衡 ($${0})",
		building_intro_LMG: "轻机枪 射程较远，杀伤力一般 ($${0})",
		building_intro_HMG: "重机枪 快速射击，威力较大，射程一般 ($${0})",
		building_intro_laser_gun: "激光枪 伤害较大，命中率 100% ($${0})",
		click_to_build: "左键点击建造 ${0} ($${1})",
		upgrade: "升级 ${0} 到 ${1} 级，需花费 $${2}。",
		sell: "出售 ${0}，可获得 $${1}",
		upgrade_success: "升级成功，${0} 已升级到 ${1} 级！下次升级需要 $${2}。",
		monster_info: "怪物: 生命 ${0}，防御 ${1}，速度 ${2}，伤害 ${3}",
		button_upgrade_text: "升级",
		button_sell_text: "出售",
		button_start_text: "开始",
		button_restart_text: "重新开始",
		button_pause_text: "暂停",
		button_continue_text: "继续",
		button_pause_desc_0: "游戏暂停",
		button_pause_desc_1: "游戏继续",
		blocked: "不能在这儿修建建筑，起点与终点之间至少要有一条路可到达！",
		monster_be_blocked: "不能在这儿修建建筑，有怪物被围起来了！",
		entrance_or_exit_be_blocked: "不能在起点或终点处修建建筑！",
		_: "ERROR"
	}, t._t = t.translate = function(t, i) {
		i = "object" == typeof i && i.constructor == Array ? i : [];
		var e, s = this._msg_texts[t] || this._msg_texts._,
			n = i.length;
		for (e = 0; n > e; e++) s = s.replace("${" + e + "}", i[e]);
		return s
	}
});
 _TD.a.push(function(t) {
	t.FindWay = function(t, i, e, s, n, h, a) {
		this.m = [], this.w = t, this.h = i, this.x1 = e, this.y1 = s, this.x2 = n, this.y2 = h, this.way = [], this.len = this.w * this.h, this.is_blocked = this.is_arrived = !1, this.fPassable = "function" == typeof a ? a : function() {
			return !0
		}, this._init()
	}, t.FindWay.prototype = {
		_init: function() {
			if (this.x1 == this.x2 && this.y1 == this.y2) return this.is_arrived = !0, void(this.way = [
				[this.x1, this.y1]
			]);
			for (var t = 0; t < this.len; t++) this.m[t] = -2;
			for (this.x = this.x1, this.y = this.y1, this.distance = 0, this.current = [
				[this.x, this.y]
			], this.setVal(this.x, this.y, 0); this.next(););
		},
		getVal: function(t, i) {
			var e = i * this.w + t;
			return e < this.len ? this.m[e] : -1
		},
		setVal: function(t, i, e) {
			var s = i * this.w + t;
			return s > this.len ? !1 : void(this.m[s] = e)
		},
		getNeighborsOf: function(t, i) {
			var e = [];
			return i > 0 && e.push([t, i - 1]), t < this.w - 1 && e.push([t + 1, i]), i < this.h - 1 && e.push([t, i + 1]), t > 0 && e.push([t - 1, i]), e
		},
		getAllNeighbors: function() {
			var t, i, e, s = [],
				n = this.current.length;
			for (i = 0; n > i; i++) e = this.current[i], t = this.getNeighborsOf(e[0], e[1]), s = s.concat(t);
			return s
		},
		findWay: function() {
			for (var t, i, e, s, n, h, a, l = this.x2, r = this.y2, c = this.len, o = -1;
			(l != this.x1 || r != this.y1) && 0 != o && this.way.length < c;) {
				for (this.way.unshift([l, r]), e = this.getNeighborsOf(l, r), i = e.length, a = [], o = -1, s = 0; i > s; s++) h = this.getVal(e[s][0], e[s][1]), 0 > h || (0 > o || o > h) && (o = h);
				for (s = 0; i > s; s++) t = e[s], o == this.getVal(t[0], t[1]) && a.push(t);
				n = a.length, s = n > 1 ? Math.floor(Math.random() * n) : 0, t = a[s], l = t[0], r = t[1]
			}
		},
		arrive: function() {
			this.current = [], this.is_arrived = !0, this.findWay()
		},
		blocked: function() {
			this.current = [], this.is_blocked = !0
		},
		next: function() {
			var t, i, e, s, n, h = this.getAllNeighbors(),
				a = h.length,
				l = [];
			for (this.distance++, s = 0; a > s; s++) if (t = h[s], i = t[0], e = t[1], -2 == this.getVal(i, e) && (this.fPassable(i, e) ? (n = this.distance, l.push(t)) : n = -1, this.setVal(i, e, n), i == this.x2 && e == this.y2)) return this.arrive(), !1;
			return 0 == l.length ? (this.blocked(), !1) : (this.current = l, !0)
		}
	}
});

//# sourceMappingURL=td-pkg-zh-min.js.map