$.fn.itxtablegrid = function (opt) {
    return this.each(function () {
        var defaults = {
            columnNames: [],
            data: {},
            treeview: false
        };
        var options = $.extend(defaults, opt);
        if ($(this)[0].tagName == "DIV") {
            var tbl = jQuery("<table>", {});
            $(this).append(tbl);
            // header section
            var header = jQuery("<tr>", {});
            if (options.columnNames.length > 0) {
                for (var colIndex = 0; colIndex < options.columnNames.length; colIndex++) {
                    var column = jQuery("<th>", {});
                    column.append(options.columnNames[colIndex]);
                    header.append(column);
                }
            }
            tbl.append(header);
            // body section
            if (options.treeview) {
                var BkupOptions = options.data;
                var FilteredValues = new Array();
                for (var rowIndex = 0; rowIndex < options.data.length; rowIndex++) {
                    for (var colIndex = 0; colIndex < options.data[rowIndex].length; colIndex++) {
                    }
                }
            }
            else {
                for (var rowIndex = 0; rowIndex < options.data.length; rowIndex++) {
                    var row = jQuery("<tr>", {});
                    for (var colIndex = 0; colIndex < options.data[rowIndex].length; colIndex++) {
                        if (colIndex == 0) {
                            var html = "<td><div class='expandable'><p>" + options.data[rowIndex][colIndex] + "</p></div></td>";
                            row.append(html);
                        }
                        else {
                            var col = jQuery("<td>", {});
                            col.append(options.data[rowIndex][colIndex]);
                            row.append(col);
                        }
                    }
                    tbl.append(row);
                }
            }
        }
    });
};