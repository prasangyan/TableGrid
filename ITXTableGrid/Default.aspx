<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ITXTableGrid._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="style.css" rel="stylesheet" type="text/css" />
    <script src="jquery-1.6.1.min.js" type="text/javascript"></script>
    <script src="ITXTableGrid.js" type="text/javascript"></script>
    <script type="text/javascript" language="javascript">
        $(function () {
            var Options = {
                columnNames: ["Name", "Period", "Status", "another column1", "another column2", "another column3"],
                data: [["some name", "some perioddsf gsdf gsdf gdsf gdfs gdsfg dsfg sdfgs", "some status", "some value11", "somevalue12", "some value13"],
                       ["some name2", "some period2", "some status2", "some value21", "somevalue22", "some value23"],
                       ["some name3", "some period3", "some status3", "some value31", "somevalue32", "some value33"],
                       ["some name", "some period3", "some status3", "some value31", "somevalue32", "some value33"],
                       ["some name2", "some period2", "some status2", "some value21", "somevalue22", "some value23"]],
                groupview: true,
                expandLevels: 2,
                expandByDefault: false,
                columnWidth: ["400px", "100px"]
            };

            $('.report-container').itxtablegrid(Options);
        });
    </script>
</head>
<body>
    <div class="report-container">
    </div>
</body>
</html>