import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Settings, LogOut, MessageSquare } from 'lucide-react';
import { Movie, Comment } from '@/types/movie';
import { getMovies, getComments, deleteMovie, deleteComment, isAdminAuthenticated, clearAdminAuthentication } from '@/utils/supabase-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import MovieUploadForm from '@/components/admin/MovieUploadForm';
import SettingsForm from '@/components/admin/SettingsForm';

const AdminDashboard = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin');
      return;
    }
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const moviesData = await getMovies();
      const commentsData = await getComments();
      setMovies(moviesData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    clearAdminAuthentication();
    toast({ title: "Logged out successfully" });
    navigate('/');
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (confirm('Are you sure you want to delete this movie? This will also delete all related comments.')) {
      try {
        await deleteMovie(movieId);
        await loadData();
        toast({ title: "Movie deleted successfully" });
      } catch (error) {
        toast({ title: "Failed to delete movie", variant: "destructive" });
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
        await loadData();
        toast({ title: "Comment deleted successfully" });
      } catch (error) {
        toast({ title: "Failed to delete comment", variant: "destructive" });
      }
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMovieUpdate = async () => {
    await loadData();
    setIsUploadOpen(false);
    setEditingMovie(null);
  };

  if (!isAdminAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="movies" className="text-sm md:text-base">
              <span className="hidden sm:inline">Movies </span>({movies.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-sm md:text-base">
              <span className="hidden sm:inline">Comments </span>({comments.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm md:text-base">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
              
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingMovie(null)} className="w-full sm:w-auto">
                    <Plus size={16} className="mr-2" />
                    <span className="hidden sm:inline">Add Movie</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                  <DialogHeader>
                    <DialogTitle>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
                  </DialogHeader>
                  <MovieUploadForm
                    movie={editingMovie}
                    onSuccess={handleMovieUpdate}
                    onCancel={() => {
                      setIsUploadOpen(false);
                      setEditingMovie(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <div key={movie.id} className="card-premium rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{movie.genre} • {movie.category}</p>
                          <p className="text-xs text-muted-foreground">{movie.releaseDate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMovie(movie);
                            setIsUploadOpen(true);
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Edit size={16} className="sm:mr-0 mr-2" />
                          <span className="sm:hidden">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="flex-1 sm:flex-none"
                        >
                          <Trash2 size={16} className="sm:mr-0 mr-2" />
                          <span className="sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No movies found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <div className="grid gap-4">
              {comments.length > 0 ? (
                comments.map((comment) => {
                  const movie = movies.find(m => m.id === comment.movieId);
                  return (
                    <div key={comment.id} className="card-premium rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                            <span className="font-semibold text-foreground">{comment.name}</span>
                            <span className="text-sm text-muted-foreground">
                              on {movie?.title || 'Unknown Movie'}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2 break-words">{comment.comment}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="flex-shrink-0 w-full sm:w-auto"
                        >
                          <Trash2 size={16} className="sm:mr-0 mr-2" />
                          <span className="sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No comments yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl">
              <SettingsForm />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;