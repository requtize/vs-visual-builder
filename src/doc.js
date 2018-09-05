vibu.doc = function (editor) {
    this.editor = editor;

    this.findAllVibuElements = function () {
        return this.editor.getNode().find('[data-vibu]');
    };

    this.findSelectableElement = function (element) {
        return element.closest('[vibu-selectable]');
    };

    this.getElementBoundaries = function (element) {
        if(! element)
            return null;

        let doc = element.get(0).ownerDocument;

        return {
            left      : element.offset().left,
            top       : element.offset().top,
            width     : element.outerWidth(),
            height    : element.outerHeight(),
            position  : element.css('position'),
            scrollTop : $(doc.defaultView || doc.parentWindow).scrollTop()
        };
    };

    this.getCanvas = function () {
        return this.editor.getNode().find('iframe');
    };

    this.getCanvasWindow = function () {
        let iframe = this.getCanvas().get(0);

        return iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument;
    };

    this.getCanvasContent = function () {
        return this.getCanvas().contents();
    };

    this.getStyles = function () {
        return this.editor.getNode().find('.vibu-sidebar-styles .vibu-sidebar-inner');
    };

    this.getBlocks = function () {
        return this.editor.getNode().find('.vibu-sidebar-blocks .vibu-sidebar-inner');
    };
}
