<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MultiLevel.aspx.cs" Inherits="ITXTableGrid.TreeView.MultiLevel" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <link href="../style.css" rel="stylesheet" type="text/css" />
    <script src="../jquery-1.6.1.min.js" type="text/javascript"></script>
    <script src="../ITXTableGrid.js" type="text/javascript"></script>
    <script type="text/javascript" language="javascript">
        $(function () {
            var output = $.parseJSON($('div.Output').html());
            var Options = {
                columnNames: ["Name", "Period", "Status", "another column1", "another column2", "another column3", "another column4", "another column5", "another column6", "another column7"],
                data: output,
                columnWidth: ["400px", "100px"],
                treeview: true
            };
            $('.report-container').itxtablegrid(Options);
        });
    </script>
    <style type="text/css">
        .Output
        {
            display: none;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div class="Output">
        <asp:Literal ID="Literal1" runat="server"></asp:Literal>
    </div>
    <div class="report-container">
    </div>
    </form>
</body>
</html>