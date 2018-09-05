vibu.selectable = function (editor) {
    this.editor = editor;

    this.selectedElement = null;
    this.hoveredElement = null;

    this.selectedLayer = null;
    this.hoveredLayer  = null;

    this.init = function () {
        let self = this;

        this.editor.on('editor.ready', function () {
            self.initAfterEditorReady();
        }, 100);

        this.editor.on('blocks.block', function (data) {
            let nodes = data.node.find('[vibu-selectable]');

            if(data.node.attr('vibu-selectable'))
                nodes = nodes.add(data.node);

            nodes.each(function () {
                self.bindElementHoverEvents($(this));
                self.bindElementClickEvents($(this));
            });
        }, 100);

        self.editor.on('selectable.hovered.on', function (data) {
            self.hoveredElement = self.editor.doc.findSelectableElement(data.element);

            /**
             * We dont hover active element.
             */
            if(self.selectedElement && self.hoveredElement.is(self.selectedElement))
                return;

            let boundaries = self.editor.doc.getElementBoundaries(self.hoveredElement);

            self.hoveredLayer
                .removeClass('vibu-hidden')
                .css({
                    width : boundaries.width,
                    height: boundaries.height,
                    left  : boundaries.left,
                    top   : boundaries.top - boundaries.scrollTop
                });
        });

        self.editor.on('selectable.hovered.update-boundaries', function () {
            let boundaries = self.editor.doc.getElementBoundaries(self.hoveredElement);

            if(boundaries)
            {
                self.hoveredLayer
                    .css({
                        width : boundaries.width,
                        height: boundaries.height,
                        left  : boundaries.left,
                        top   : boundaries.top - boundaries.scrollTop
                    });
            }
        });

        self.editor.on('selectable.hovered.out', function () {
            self.hoveredLayer.addClass('vibu-hidden');
        });



        self.editor.on('selectable.selected.new', function (data) {
            self.selectedElement = self.editor.doc.findSelectableElement(data.element);

            let boundaries = self.editor.doc.getElementBoundaries(self.selectedElement);

            self.selectedLayer.removeClass('vibu-hidden');
            self.selectedLayer.css({
                width : boundaries.width,
                height: boundaries.height,
                left  : boundaries.left,
                top   : boundaries.top - boundaries.scrollTop
            });

            self.selectedLayer.find('.vibu-node-name').text(self.selectedElement.get(0).tagName);
        });

        self.editor.on('selectable.selected.update-boundaries', function () {
            let boundaries = self.editor.doc.getElementBoundaries(self.selectedElement);

            if(boundaries)
            {
                self.selectedLayer.css({
                    width : boundaries.width,
                    height: boundaries.height,
                    left  : boundaries.left,
                    top   : boundaries.top - boundaries.scrollTop
                });
            }
        });

        self.editor.on('selectable.selected.none', function () {
            self.selectedElement = null;
            self.selectedLayer.addClass('vibu-hidden');
        });
    };

    this.initAfterEditorReady = function () {
        let self   = this;

        this.selectedLayer = this.editor.getNode().find('.vibu-element-boundaries-active');
        this.hoveredLayer  = this.editor.getNode().find('.vibu-element-boundaries-hover');

        $(this.editor.doc.getCanvasWindow()).on('scroll resize', function () {
            if(self.selectedElement)
                self.editor.trigger('selectable.selected.update-boundaries');

            if(self.hoveredElement)
                self.editor.trigger('selectable.hovered.update-boundaries');
        });

        this.editor.canvas.getBody().click(function () {
            self.editor.trigger('selectable.selected.none', {
                element: self.selectedElement
            });
        });
    };

    this.load = function (onLoad) {};

    this.bindElementHoverEvents = function (element) {
        let self = this;

        element.hover(function () {
            self.editor.trigger('selectable.hovered.on', {
                element: element
            });
        }, function () {
            self.editor.trigger('selectable.hovered.out', {
                element: element
            });
        });
    };

    this.bindElementClickEvents = function (element) {
        let self = this;

        element.click(function (DOMEvent) {
            DOMEvent.preventDefault();
            DOMEvent.stopPropagation();

            self.editor.trigger('selectable.selected.new', {
                element: element
            });
        });
    };

    this.updateActiveElement = function () {
        this.editor.trigger('selectable.selected.update-boundaries');
    };

    this.updateHoveredElement = function () {
        this.editor.trigger('selectable.hovered.update-boundaries');
    };
};
