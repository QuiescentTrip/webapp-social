using System;
using System.Collections.Generic;

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string ImageUrl { get; set; }
    public int Likes { get; set; }
    public DateTime Created { get; set; }
    public List<Comment> Comments { get; set; } = new List<Comment>();
}