using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ITXTableGrid
{
    public partial class Test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                var toprow = new Rows();
                for (int i = 0; i < 10; i++)
                    toprow.elements.Add((i + 1).ToString());
                var childrow = new Rows();
                for (int i = 0; i < 10; i++)
                    childrow.elements.Add((i + 1).ToString());
                toprow.childrows.Add(childrow);

                var childrow2 = new Rows();
                for (int i = 0; i < 10; i++)
                    childrow2.elements.Add((i + 1).ToString());

                childrow.childrows.Add(childrow2);

                toprow.childrows.Add(childrow);
                Literal1.Text = Serialize(toprow);
            }
        }

        public string Serialize(object value)
        {
            Type type = value.GetType();
            var json = new JsonSerializer();
            json.NullValueHandling = NullValueHandling.Ignore;
            json.ObjectCreationHandling = ObjectCreationHandling.Replace;
            json.MissingMemberHandling = MissingMemberHandling.Ignore;
            json.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            if (type == typeof(DataTable))
                json.Converters.Add(new DataTableConverter());
            else if (type == typeof(DataSet))
                json.Converters.Add(new DataSetConverter());
            var sw = new StringWriter();
            var writer = new JsonTextWriter(sw);
            writer.Formatting = Formatting.Indented;
            writer.QuoteChar = '"';
            json.Serialize(writer, value);
            string output = sw.ToString();
            writer.Close();
            sw.Close();
            return output;
        }
    }

    public class Rows
    {
        public Rows()
        {
            elements = new List<string>();
            childrows = new List<Rows>();
        }

        public List<string> elements;
        public List<Rows> childrows;
    }
}