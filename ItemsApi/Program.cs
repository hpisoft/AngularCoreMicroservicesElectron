using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using dotenv.net;

namespace ItemsApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var config = new ConfigurationBuilder()
                            .AddCommandLine(args)
                            .Build();
            DotEnv.Config(false, ".env", Encoding.Unicode);
            var serverurls = string.Format("http://localhost:{0}", Environment.GetEnvironmentVariable("PORT"));
            return WebHost.CreateDefaultBuilder(args)
                .UseConfiguration(config)
                .ConfigureLogging(f => f.AddConsole())
                .UseStartup<Startup>()
                .UseUrls(serverurls)
                .Build();
        }
    }
}
