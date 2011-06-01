var ExpandColumnIndex = 0;
$.fn.itxtablegrid = function (opt) {
    return this.each(function () {
        var defaults = {
            columnNames: [],
            data: {},
            treeview: false
        };
        var options = $.extend(defaults, opt);
        var TreeData = new Array();
        var LevelIndex = 0;
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
                var BkupData = options.data;
                ArrangeDataTree(BkupData, TreeData, LevelIndex);
                DisplayTreeData(tbl, TreeData);
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
    function ArrangeDataTree(Data, TreeData, LevelIndex) {
        if (Data.length > 0) {
            if (Data[0].length > 0) {
                var groupvalue = Data[0][ExpandColumnIndex].toString().toLowerCase();
                groupvalue = $.trim(groupvalue);
                var TrData = {};
                var IsDataElementsModified = true;
                while (IsDataElementsModified) {
                    IsDataElementsModified = false;
                    for (var index = 0; index < Data.length; index++) {
                        var value = Data[index][ExpandColumnIndex].toString().toLowerCase();
                        value = $.trim(value);
                        if (value == groupvalue) {
                            TrData.Keyname = value;
                            if (TrData.childvalues == undefined) {
                                TrData.childvalues = new Array();
                            }
                            var childindex = 0;
                            var RowValues = new Array();
                            for (var colindex = 0; colindex < Data[index].length; colindex++) {
                                if (ExpandColumnIndex != colindex)
                                    RowValues[childindex++] = Data[index][colindex].toString();
                            }
                            TrData.childvalues[TrData.childvalues.length] = RowValues;
                            Data.splice(index, 1);
                            IsDataElementsModified = true;
                            break;
                        }
                    }
                }
                TrData.LevelIndex = LevelIndex;
                TreeData[TreeData.length] = TrData;
                ArrangeDataTree(Data, TreeData, LevelIndex);
            }
        }
    }
    function DisplayTreeData(Table, TreeData) {
        for (var rowIndex = 0; rowIndex < TreeData.length; rowIndex++) {
            var row = jQuery("<tr>", {});
            var html = "";
            if (TreeData[rowIndex].childvalues > 1)
                html = "<td><div class='expandable level-0'><img src='Expand.png'/><p>" + TreeData[rowIndex][ExpandColumnIndex] + "</p></div></td>";
            else
                html = "<td><div class='expandable level-0'><p>" + TreeData[rowIndex][ExpandColumnIndex] + "</p></div></td>";
            Table.append(row);
            for (var childvalues = 1; childvalues < TreeData.childvalues; childvalues++) {
                var row = jQuery("<tr>", {});
                var html = "<td><div class='expandable level-0'><p>" + TreeData[rowIndex][colIndex] + "</p></div></td>";
                Table.append(row);
            }
        }
    }
};