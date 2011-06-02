var ExpandColumnIndex = 0;
var processedIndex = {};
$.fn.itxtablegrid = function (opt) {
    return this.each(function () {
        var defaults = {
            columnNames: [],
            data: {},
            groupview: false,
            expandLevels: 1,
            expandByDefault: true,
            columnWidth: []
        };
        var options = $.extend(defaults, opt);
        var TreeData = new Array();
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
            if (options.groupview) {
                var BkupData = options.data;
                if (options.expandLevels == 1) {
                    ArrangeDataTree_level_1(BkupData, TreeData);
                    DisplayGroupData_Level_1(tbl, TreeData, options.expandByDefault, options.columnWidth);
                    BindExpandCollapseEvents();
                }
                else {
                    ArrangeDataTree(BkupData, TreeData, options.expandLevels);
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
    function ArrangeDataTree(Data, TreeData, NoOfLevels) {
        for (var rowIndex = 0; rowIndex < Data.length; rowIndex++) {
            if (processedIndex[rowIndex] == undefined) {
                var row = {};
                row.keyname = Data[rowIndex][0].toString();
                var keyrow = [];
                for (var colindex = 0; colindex < Data[rowIndex].length; colindex++)
                    keyrow[colindex] = Data[rowIndex][colindex].toString();
                row.keyrow = keyrow;
                processedIndex[rowIndex] = true;
                row.childrows = GetChildRows(Data[rowIndex][0].toString(), Data, 0);
                TreeData[TreeData.length] = row;
            }
        }
        // Second Level Grouping with arranged data tree
        for (var rowIndex = 0; rowIndex < TreeData.length; rowIndex++) {
            for (var childrowIndex = 0; childrowIndex < TreeData[rowIndex].childrows.length; childrowIndex++) {
                debugger;
            }
        }
    }
    function GetChildRows(Keyname, Data, LevelIndex) {
        var OutputRows = [];
        var value = Keyname.toString().toLowerCase();
        value = $.trim(value);
        for (var rowIndex = 0; rowIndex < Data.length; rowIndex++) {
            if (processedIndex[rowIndex] == undefined) {
                var comparevalue = Data[rowIndex][LevelIndex].toString().toLowerCase();
                comparevalue = $.trim(comparevalue);
                if (comparevalue == value) {
                    var outputrow = {};
                    outputrow.keyname = Data[rowIndex][LevelIndex + 1].toString().toLowerCase();
                    var keyrow = [];
                    for (var colindex = LevelIndex + 1; colindex < Data[rowIndex].length; colindex++)
                        keyrow[colindex] = Data[rowIndex][colindex].toString();
                    outputrow.keyrow = keyrow;
                    outputrow.childrows = [];
                    OutputRows[OutputRows.length] = outputrow;
                    processedIndex[rowIndex] = true;
                }
            }
        }
        return OutputRows;
    }
    function ArrangeDataTree_level_1(Data, TreeData) {
        if (Data.length > 0) {
            if (Data[0].length > 0) {
                var groupvalue = "";
                for (var index = 0; index < Data.length; index++) {
                    if (processedIndex[index] == undefined) {
                        try {
                            groupvalue = Data[index][ExpandColumnIndex].toString();
                            break;
                        } catch (e) { }
                    }
                }
                groupvalue = $.trim(groupvalue);
                if (groupvalue != "") {
                    var TrData = {};
                    for (var index = 0; index < Data.length; index++) {
                        if (processedIndex[index] == undefined) {
                            if (Data[index] != undefined) {
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
                                    processedIndex[index] = true;
                                }
                            }
                        }
                    }
                    TreeData[TreeData.length] = TrData;
                    ArrangeDataTree_level_1(Data, TreeData);
                }
            }
        }
    }
    function DisplayGroupData_Level_1(Table, TreeData, expandByDefault, columnWidth) {
        for (var rowIndex = 0; rowIndex < TreeData.length; rowIndex++) {
            var row = jQuery("<tr>", {});
            var html = "";
            if (TreeData[rowIndex].childvalues.length > 1) {
                var td = jQuery("<td>", {});
                if (columnWidth[0] != undefined)
                    td.attr('width', columnWidth[0]);
                if (expandByDefault) {
                    td.append("<div class='expandable level-0'><img src='Images/Collapse.png' ExpandStatus='1' /><p>" + TreeData[rowIndex].Keyname + "</p></div>");
                }
                else {
                    td.append("<div class='expandable level-0'><img src='Images/Expand.png' ExpandStatus='0' /><p>" + TreeData[rowIndex].Keyname + "</p></div>");
                }
                row.append(td);
                // adding additional columns for top level row
                for (var ColIndex = 0; ColIndex < TreeData[rowIndex].childvalues[0].length; ColIndex++) {
                    td = jQuery("<td>", {});
                    if (columnWidth[ColIndex + 1] != undefined)
                        td.attr('width', columnWidth[ColIndex + 1]);
                    row.append(td);
                }
                Table.append(row);
                // Adding child rows here.
                for (var childvalues = 0; childvalues < TreeData[rowIndex].childvalues.length; childvalues++) {
                    row = jQuery("<tr>", { "KeyName": TreeData[rowIndex].Keyname });
                    html = "<td><div class='expandable level-1'><p></p></div></td>";
                    row.append(html);
                    for (var ColIndex = 0; ColIndex < TreeData[rowIndex].childvalues[childvalues].length; ColIndex++) {
                        var html = "<td>" + TreeData[rowIndex].childvalues[childvalues][ColIndex].toString() + "</td>";
                        row.append(html);
                    }
                    Table.append(row);
                    if (!expandByDefault)
                        row.hide();
                }
            }
            else {
                html = "<td><div class='expandable level-0'><p>" + TreeData[rowIndex].Keyname + "</p></div></td>";
                row.append(html);
                // adding additional columns for top level row
                for (var ColIndex = 0; ColIndex < TreeData[rowIndex].childvalues[0].length; ColIndex++) {
                    var html = "<td>" + TreeData[rowIndex].childvalues[0][ColIndex].toString() + "</td>";
                    row.append(html);
                }
                Table.append(row);
            }
        }
    }
    function BindExpandCollapseEvents() {
        $('tr td div img').click(function () {
            if ($(this).attr('ExpandStatus') == "1") {
                $('tr[KeyName="' + $(this).parent().find('p').html() + '"]').fadeOut(500);
                $(this).attr('ExpandStatus', 0);
                $(this).attr('src', '/Images/Expand.png');
            }
            else {
                $('tr[KeyName="' + $(this).parent().find('p').html() + '"]').fadeIn(500);
                $(this).attr('ExpandStatus', 1);
                $(this).attr('src', '/Images/Collapse.png');
            }
        });
    }
    function DisplayTreeData(Table, TreeData, expandByDefault) {
        for (var rowIndex = 0; rowIndex < TreeData.length; rowIndex++) {
            var row = jQuery("<tr>", { "KeyName": TreeData[rowIndex].Keyname });
            var html = "";
            if (TreeData[rowIndex].childvalues.length > 1) {
                if (expandByDefault)
                    html = "<td><div class='expandable level-0'><img src='Images/Expand.png' ExpandStatus='1'/><p>" + TreeData[rowIndex].Keyname + "</p></div></td>";
                else
                    html = "<td><div class='expandable level-0'><img src='Images/Collapse.png' ExpandStatus='0'/><p>" + TreeData[rowIndex].Keyname + "</p></div></td>";
            }
            else {
                html = "<td><div class='expandable level-0'><p>" + TreeData[rowIndex].Keyname + "</p></div></td>";
            }
            row.append(html);
            // adding additional columns for top level row
            for (var ColIndex = 0; ColIndex < TreeData[rowIndex].childvalues[0].length; ColIndex++) {
                var html = "<td>" + TreeData[rowIndex].childvalues[0][ColIndex].toString() + "</td>";
                row.append(html);
            }
            Table.append(row);
            // Adding child rows here.
            for (var childvalues = 1; childvalues < TreeData[rowIndex].childvalues.length; childvalues++) {
                row = jQuery("<tr>", {});
                html = "<td><div class='expandable level-1'><p>" + TreeData[rowIndex].Keyname + "</p></div></td>";
                row.append(html);
                for (var ColIndex = 0; ColIndex < TreeData[rowIndex].childvalues[childvalues].length; ColIndex++) {
                    var html = "<td>" + TreeData[rowIndex].childvalues[childvalues][ColIndex].toString() + "</td>";
                    row.append(html);
                }
                Table.append(row);
            }
        }
    }
};