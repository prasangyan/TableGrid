using System;
using System.Collections.Generic;

namespace ITXTableGrid
{
    public partial class _Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            List<Rows> rows = new List<Rows>();
            Rows row = new Rows();
            row.values = new string[] { "", "", "" };
            row.childvalues = new List<Rows>();
        }

        public struct Rows
        {
            public string[] values;
            public List<Rows> childvalues;
            int levelIndex;
        }
    }
}