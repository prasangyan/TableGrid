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
                var colIndex = 0;

                var column = jQuery("<th>", {});
                column.append(options.columnNames[0]);
                header.append(column);

                if (options.groupview) {
                    colIndex = options.expandLevels;
                }

                for (; colIndex < options.columnNames.length; colIndex++) {
                    column = jQuery("<th>", {});
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
                    TreeData = ArrangeDataIntoJSObjects(options.data, TreeData, options.expandLevels);
                    DisplayGroupData_MultiLevels(tbl, TreeData, options.expandByDefault, options.columnWidth, options.columnNames, options.expandLevels);
                    BindExpandCollapseEvents();
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

    function GroupData(Data, KeyColumnIndex) {
        processedIndex = []
        var Level1Group = [];
        // grouping first field
        for (var rowIndex = 0; rowIndex < Data.length; rowIndex++) {
            if (processedIndex[rowIndex] == undefined && Data[rowIndex] != undefined) {
                if (Level1Group[Level1Group.length] == undefined)
                    Level1Group[Level1Group.length] = [];
                var LevelIndex = Level1Group.length - 1;
                var key_value = Data[rowIndex][KeyColumnIndex].toString().toLowerCase();
                key_value = $.trim(key_value);
                for (var rindex = 0; rindex < Data.length; rindex++) {
                    if (processedIndex[rindex] == undefined && Data[rindex] != undefined) {
                        var cur_value = Data[rindex][KeyColumnIndex].toString().toLowerCase();
                        var cur_value = $.trim(cur_value);
                        if (key_value == cur_value) {
                            var temprow = [];
                            for (var colindex = 0; colindex < Data[rindex].length; colindex++) {
                                temprow[colindex] = Data[rindex][colindex].toString();
                            }
                            processedIndex[rindex] = true;
                            Level1Group[LevelIndex][Level1Group[LevelIndex].length] = temprow;
                        }
                    }
                }
            }
        }
        return Level1Group;
    }

    function ArrangeDataIntoJSObjects(Data, TreeData, ExpandLevels) {
        // grouping second level here
        var Level1Group = GroupData(Data, 0);
        var Level2Group = [];

        for (var groupIndex = 0; groupIndex < Level1Group.length; groupIndex++) {
            if (Level1Group[groupIndex].length > 1) {
                var subtree = [];
                subtree.parent_node_name = Level1Group[groupIndex][0][0];
                subtree.child_nodes = [];
                var childnodes = GroupData(Level1Group[groupIndex], 1);
                // level 2 scrapping here
                for (var groupIndex2 = 0; groupIndex2 < childnodes.length; groupIndex2++) {
                    if (childnodes[groupIndex2].length > 1) {
                        var subtree2 = [];
                        subtree2.parent_node_name = childnodes[groupIndex2][0][1]
                        if (ExpandLevels > 2) {
                            var childnodes3 = GroupData(Level1Group[groupIndex], 2);
                            subtree2.child_nodes = [];

                            // level 3 scrapping here
                            for (var groupIndex3 = 0; groupIndex3 < childnodes3.length; groupIndex3++) {
                                if (childnodes3[groupIndex3].length > 1) {
                                    var subtree3 = [];
                                    subtree3.parent_node_name = childnodes3[groupIndex3][0][2]
                                    subtree3.child_nodes = childnodes3[groupIndex3];  // stoping the levels here
                                    subtree2.child_nodes[subtree2.child_nodes.length] = subtree3;
                                }
                                else if (childnodes3[groupIndex3].length == 1) {
                                    var temprow = [];
                                    for (var colindex = 0; colindex < childnodes[groupIndex2][0].length; colindex++) {
                                        temprow[colindex] = childnodes[groupIndex2][0][colindex].toString();
                                    }
                                    subtree2.child_nodes[subtree2.child_nodes.length] = temprow;
                                }
                            }
                        }
                        else {
                            subtree2.child_nodes = childnodes[groupIndex2];
                        }
                        subtree.child_nodes[subtree.child_nodes.length] = subtree2;
                    }
                    else if (childnodes[groupIndex2].length == 1) {
                        var temprow = [];
                        for (var colindex = 0; colindex < childnodes[groupIndex2][0].length; colindex++) {
                            temprow[colindex] = childnodes[groupIndex2][0][colindex].toString();
                        }
                        subtree.child_nodes[subtree.child_nodes.length] = temprow;
                    }
                }
                Level2Group[Level2Group.length] = subtree;
            }
            else if (Level1Group[groupIndex].length == 1) {
                var temprow = [];
                for (var colindex = 0; colindex < Level1Group[groupIndex][0].length; colindex++) {
                    temprow[colindex] = Level1Group[groupIndex][0][colindex].toString();
                }
                Level2Group[Level2Group.length] = temprow;
            }
        }
        return Level2Group;
    }

    function DisplayGroupData_MultiLevels(Table, TreeData, expandByDefault, columnWidth, columnNames, noofexpandColumns) {
        for (var rowIndex1 = 0; rowIndex1 < TreeData.length; rowIndex1++) {
            var row1 = jQuery("<tr>", {});
            var html1 = "";
            if (TreeData[rowIndex1].parent_node_name == undefined) {
                // only a row is there, print without expand image
                html1 = "<td><div class='expandable level-0'><p>" + TreeData[rowIndex1][0] + "</p></div></td>";
                row1.append(html1);
                // adding additional columns for top level row
                for (var ColIndex = noofexpandColumns; ColIndex < TreeData[rowIndex1].length; ColIndex++) {
                    html1 = "<td>" + TreeData[rowIndex1][ColIndex].toString() + "</td>";
                    row1.append(html1);
                }
                Table.append(row1);
            }
            else {
                // level 1 starts here
                var TreeData1 = TreeData[rowIndex1];
                var td = jQuery("<td>", {});
                if (columnWidth[0] != undefined)
                    td.attr('width', columnWidth[0]);
                if (expandByDefault) {
                    td.append("<div class='expandable level-0'><img src='Images/Expand.png' ExpandStatus='1' /><p>" + TreeData1.parent_node_name + "</p></div>");
                }
                else {
                    td.append("<div class='expandable level-0'><img src='Images/Collapse.png' ExpandStatus='0' /><p>" + TreeData1.parent_node_name + "</p></div>");
                }
                row1.append(td);
                // adding additional columns for level 1
                for (var ColIndex = noofexpandColumns; ColIndex < columnNames.length; ColIndex++) {
                    td = jQuery("<td>", {});
                    if (columnWidth[ColIndex + 1] != undefined)
                        td.attr('width', columnWidth[ColIndex + 1]);
                    row1.append(td);
                }
                Table.append(row1);
                // level 1 rows
                var TreeData2 = TreeData[rowIndex1].child_nodes;
                for (var child_row1 = 0; child_row1 < TreeData2.length; child_row1++) {
                    row1 = jQuery("<tr>", { "KeyName": TreeData1.parent_node_name });
                    if (TreeData2[child_row1].parent_node_name == undefined) {
                        // only a row is there, print without expand image
                        html1 = "<td><div class='expandable level-1'><p>" + TreeData2[child_row1][1] + "</p></div></td>";
                        row1.append(html1);
                        // adding additional columns for top level row
                        for (var ColIndex = noofexpandColumns; ColIndex < TreeData2[child_row1].length; ColIndex++) {
                            html1 = "<td>" + TreeData2[child_row1][ColIndex].toString() + "</td>";
                            row1.append(html1);
                        }
                        Table.append(row1);
                    }
                    else {
                        // level 2 starts here
                        var TreeData3 = TreeData2[child_row1];
                        var td = jQuery("<td>", {});
                        if (columnWidth[0] != undefined)
                            td.attr('width', columnWidth[0]);
                        if (expandByDefault) {
                            td.append("<div class='expandable level-1'><img src='Images/Expand.png' ExpandStatus='1' /><p>" + TreeData3.parent_node_name + "</p></div>");
                        }
                        else {
                            td.append("<div class='expandable level-1'><img src='Images/Collapse.png' ExpandStatus='0' /><p>" + TreeData3.parent_node_name + "</p></div>");
                        }
                        row1.append(td);
                        // adding additional columns for level 1
                        for (var ColIndex = noofexpandColumns; ColIndex < columnNames.length; ColIndex++) {
                            td = jQuery("<td>", {});
                            if (columnWidth[ColIndex + 1] != undefined)
                                td.attr('width', columnWidth[ColIndex + 1]);
                            row1.append(td);
                        }
                        Table.append(row1);
                        // Level 2 rows
                        var TreeData4 = TreeData2[child_row1].child_nodes;
                        for (var child_row2 = 0; child_row2 < TreeData4.length; child_row2++) {
                            row1 = jQuery("<tr>", { "KeyName": TreeData3.parent_node_name });
                            if (TreeData4[child_row2].parent_node_name == undefined) {
                                // only a row is there, print without expand image
                                html1 = "<td><div class='expandable level-2'><p>" + TreeData4[child_row2][2] + "</p></div></td>";
                                row1.append(html1);
                                // adding additional columns for top level row
                                for (var ColIndex = noofexpandColumns; ColIndex < TreeData4[child_row2].length; ColIndex++) {
                                    html1 = "<td>" + TreeData4[child_row2][ColIndex].toString() + "</td>";
                                    row1.append(html1);
                                }
                                Table.append(row1);
                            }
                            else {
                                // Level 3 starts here
                                var TreeData5 = TreeData4[child_row2];
                                var td = jQuery("<td>", {});
                                if (columnWidth[0] != undefined)
                                    td.attr('width', columnWidth[0]);
                                if (expandByDefault) {
                                    td.append("<div class='expandable level-2'><img src='Images/Expand.png' ExpandStatus='1' /><p>" + TreeData5.parent_node_name + "</p></div>");
                                }
                                else {
                                    td.append("<div class='expandable level-2'><img src='Images/Collapse.png' ExpandStatus='0' /><p>" + TreeData5.parent_node_name + "</p></div>");
                                }
                                row1.append(td);
                                // adding additional columns for level 1
                                for (var ColIndex = noofexpandColumns; ColIndex < columnNames.length; ColIndex++) {
                                    td = jQuery("<td>", {});
                                    if (columnWidth[ColIndex + 1] != undefined)
                                        td.attr('width', columnWidth[ColIndex + 1]);
                                    row1.append(td);
                                }
                                Table.append(row1);
                                // Level 3 rows
                                var TreeData6 = TreeData5.child_nodes;
                                for (var child_row3 = 0; child_row3 < TreeData6.length; child_row3++) {
                                    row1 = jQuery("<tr>", { "KeyName": TreeData5.parent_node_name });
                                    if (TreeData6[child_row3].parent_node_name == undefined) {
                                        // only a row is there, print without expand image
                                        html1 = "<td><div class='expandable level-3'><p>" + TreeData6[child_row3][2] + "</p></div></td>";
                                        row1.append(html1);
                                        // adding additional columns for top level row
                                        for (var ColIndex = noofexpandColumns; ColIndex < TreeData6[child_row3].length; ColIndex++) {
                                            html1 = "<td>" + TreeData6[child_row3][ColIndex].toString() + "</td>";
                                            row1.append(html1);
                                        }
                                        Table.append(row1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
                ExpandorCollapseElements($(this).parent().find('p').html(), false);
                //$('tr[KeyName="' + $(this).parent().find('p').html() +'"]').fadeIn(500);
                $(this).attr('ExpandStatus', 0);
                $(this).attr('src', '/Images/Expand.png');
            }
            else {
                ExpandorCollapseElements($(this).parent().find('p').html(), true);
                //$('tr[KeyName="' + $(this).parent().find('p').html() + '"]').fadeOut(500);
                $(this).attr('ExpandStatus', 1);
                $(this).attr('src', '/Images/Collapse.png');
            }
        }).mouseover(function () {
            if ($(this).attr('ExpandStatus') == "1")
                $(this).attr('src', '/Images/Expand-Hover.png');
            else
                $(this).attr('src', '/Images/Collapse-hover.png');
        }).mouseout(function () {
            if ($(this).attr('ExpandStatus') == "1")
                $(this).attr('src', '/Images/Expand.png');
            else
                $(this).attr('src', '/Images/Collapse.png');
        });
    }

    function ExpandorCollapseElements(keyname, IsExpand) {
        var elements = $('tr[KeyName="' + keyname + '"]');
        if (IsExpand)
            elements.fadeOut(500);
        else
            elements.fadeIn(500);
        elements.find("div.expandable img").attr('ExpandStatus', "0");
        elements.find("div.expandable img").attr('src', '/Images/Collapse.png');
        elements.each(function () {
            $(this).find("div.expandable img").each(function () {
                ExpandorCollapseElements($(this).parent().find('p').html(), IsExpand);
            });
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