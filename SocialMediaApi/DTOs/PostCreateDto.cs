using System.ComponentModel.DataAnnotations;

public class PostCreateDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public required string Title { get; set; }

    [Required]
    public required IFormFile Image { get; set; }
}