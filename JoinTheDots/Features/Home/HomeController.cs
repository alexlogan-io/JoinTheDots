using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JoinTheDots.Features.Home
{
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("api/dots")]
        public JsonResult AddDots([FromBody]Object dots)
        {
            if (!string.IsNullOrEmpty(dots.ToString()))
            {
                HttpContext.Session.SetString("dots", dots.ToString());
                Response.StatusCode = 200;
                return Json(new { Message = "Saved to session" });
            }
            else
            {
                Response.StatusCode = 500;
                return Json(new { Message = "No body data" });
            }
        }

        [HttpGet("api/dots")]
        public JsonResult GetDots()
        {
            var dots = HttpContext.Session.GetString("dots");
            return Json(dots);
        }
    }
}
