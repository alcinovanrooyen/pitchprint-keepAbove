(function(){
    app.events.on('depth-updated', keepAbove);
    app.events.on('design-loaded', readyPageCanvases);

    let pageCanvases = [];
    let canReadyPages = 50;

    function readyPageCanvases() {
        if (!designer.model.runtime.design || !designer.model.runtime.design.cPage) {
            if (canReadyPages) {
                setTimeout(readyPageCanvases, 500); 
                canReadyPages--;
            }
            return;
        }
        app.events.on('page-select-end', listenPageAdd);
        listenPageAdd({data: designer.model.runtime.design.cPage.id});
    }
    // readyPageCanvases();

    function listenPageAdd(e) {
        if (pageCanvases.indexOf(e.data) > -1) return;
        designer.model.runtime.design.cPage.canvas.on('object:added', keepAbove);
    }

    function keepAbove() {
        const canvas = designer.model.runtime.design.cPage.canvas;
        const upperItem = canvas._objects.filter(_ => (_.chain && _.chain.match(/keepAbove/)));
        if (!upperItem.length) return; 
        canvas.bringToFront(upperItem[0], true);
    }

    const i = removeFromArray = fabric.util.removeFromArray;
    
    fabric.Canvas.prototype.bringToFront = function(t,custom) {
        if (!t)
            return this;
        var e, n, r, s = this._activeGroup;
        if (t === s)
            for (r = s._objects,
            e = 0; e < r.length; e++)
                n = r[e],
                i(this._objects, n),
                this._objects.push(n);
        else
            i(this._objects, t),
            this._objects.push(t);
        if (!custom) window.app.events.fire('depth-updated');
        return this.renderAll && this.renderAll()
    }

    fabric.Canvas.prototype.bringForward = function (object, intersecting) {
        if (!object) {
          return this;
        }
        var activeSelection = this._activeObject,
            i, obj, idx, newIdx, objs, objsMoved = 0;
        if (object === activeSelection && object.type === 'activeSelection') {
          objs = activeSelection._objects;
          for (i = objs.length; i--;) {
            obj = objs[i];
            idx = this._objects.indexOf(obj);
            if (idx < this._objects.length - 1 - objsMoved) {
              newIdx = idx + 1;
              removeFromArray(this._objects, obj);
              this._objects.splice(newIdx, 0, obj);
            }
            objsMoved++;
          }
        }
        else {
          idx = this._objects.indexOf(object);
          if (idx !== this._objects.length - 1) {
            // if object is not on top of stack (last item in an array)
            newIdx = this._findNewUpperIndex(object, idx, intersecting);
            removeFromArray(this._objects, object);
            this._objects.splice(newIdx, 0, object);
          }
        }
        this.renderOnAddRemove && designer.model.runtime.design.cPage.canvas.renderAll();
        app.events.fire('depth-updated');
        return this;
      }
})();