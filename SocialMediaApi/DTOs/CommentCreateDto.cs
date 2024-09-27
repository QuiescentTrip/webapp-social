using System.ComponentModel.DataAnnotations;

namespace SocialMediaApi.Models
{
    public class CommentCreateDto
    {
        [Required]
        [MinLength(3)]
        public required string Content { get; set; }
        [Required]
        public required int PostId { get; set; }
    }
}