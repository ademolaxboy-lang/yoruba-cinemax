import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Download, Users } from 'lucide-react';
import { Movie, Comment } from '@/types/movie';
import { getMovies, getCommentsForMovie, saveComment, generateId } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const movies = getMovies();
      const foundMovie = movies.find(m => m.id === id);
      setMovie(foundMovie || null);

      const movieComments = getCommentsForMovie(id);
      setComments(movieComments);
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie || !newComment.name.trim() || !newComment.comment.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const comment: Comment = {
      id: generateId(),
      movieId: movie.id,
      name: newComment.name.trim(),
      comment: newComment.comment.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      saveComment(comment);
      setComments(prev => [comment, ...prev]);
      setNewComment({ name: '', comment: '' });
      toast({ title: "Comment posted successfully!" });
    } catch (error) {
      toast({ title: "Failed to post comment", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (movie?.downloadLink) {
      window.open(movie.downloadLink, '_blank');
      toast({ title: "Download started!" });
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Movie not found</h2>
            <Link to="/" className="text-primary hover:underline">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-glow transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Movies</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="card-premium rounded-lg overflow-hidden animate-float">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="fade-in">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Star size={18} className="text-secondary fill-current" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={18} />
                    <span>{movie.runtime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>{movie.releaseDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Genre</h3>
                    <p className="text-muted-foreground">{movie.genre}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Category</h3>
                    <p className="text-muted-foreground capitalize">{movie.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Stars</h3>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users size={16} />
                      <span>{movie.stars.join(', ')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Release Date</h3>
                    <p className="text-muted-foreground">{movie.releaseDate}</p>
                  </div>
                </div>

                {movie.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-lg font-medium text-foreground mb-4">
                    Get the movie below
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all duration-300 animate-glow"
                  >
                    <Download className="mr-2" size={20} />
                    Download Movie
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-6">Comments</h2>
            
            {/* Comment Form */}
            <div className="card-premium rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Leave a Comment</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
                <Textarea
                  placeholder="Your comment"
                  value={newComment.comment}
                  onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full min-h-24"
                />
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="card-premium rounded-lg p-4 fade-in">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">{comment.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetails;