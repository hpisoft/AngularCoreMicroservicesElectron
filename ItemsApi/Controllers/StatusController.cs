using Microsoft.AspNetCore.Mvc;

namespace ItemsApi.Controllers
{
    [Route("api/[controller]")]
    public class StatusController : Controller
    {
        [HttpGet]
        public string Get()
        {
            return "OK";
        }
    }
}
