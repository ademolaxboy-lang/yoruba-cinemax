import { useState } from 'react';
import { Movie } from '@/types/movie';
import { saveMovie, generateId } from '@/utils/supabase-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface MovieUploadFormProps {
  movie?: Movie | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const MovieUploadForm = ({ movie, onSuccess, onCancel }: MovieUploadFormProps) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    poster: movie?.poster || '',
    downloadLink: movie?.downloadLink || '',
    genre: movie?.genre || '',
    releaseDate: movie?.releaseDate || '',
    stars: movie?.stars.join(', ') || '',
    runtime: movie?.runtime || '',
    rating: movie?.rating.toString() || '',
    category: movie?.category || '',
    description: movie?.description || '',
    popularity: movie?.popularity.toString() || '0'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, poster: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const movieData: Movie = {
        id: movie?.id || generateId(),
        title: formData.title.trim(),
        poster: formData.poster,
        downloadLink: formData.downloadLink.trim(),
        genre: formData.genre.trim(),
        releaseDate: formData.releaseDate,
        stars: formData.stars.split(',').map(s => s.trim()).filter(Boolean),
        runtime: formData.runtime.trim(),
        rating: parseFloat(formData.rating) || 0,
        category: formData.category,
        description: formData.description.trim(),
        popularity: parseInt(formData.popularity) || 0,
        createdAt: movie?.createdAt || new Date().toISOString()
      };

      saveMovie(movieData);
      toast({ title: movie ? "Movie updated successfully!" : "Movie added successfully!" });
      onSuccess();
    } catch (error) {
      toast({ title: "Failed to save movie", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Movie Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="genre">Genre *</Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) => handleInputChange('genre', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="thriller">Thriller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="releaseDate">Release Date *</Label>
          <Input
            id="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={(e) => handleInputChange('releaseDate', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="runtime">Runtime *</Label>
          <Input
            id="runtime"
            placeholder="e.g., 2h 30m"
            value={formData.runtime}
            onChange={(e) => handleInputChange('runtime', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="rating">Rating (0-10) *</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="popularity">Popularity Score</Label>
          <Input
            id="popularity"
            type="number"
            min="0"
            value={formData.popularity}
            onChange={(e) => handleInputChange('popularity', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="stars">Stars (comma separated) *</Label>
        <Input
          id="stars"
          placeholder="Actor 1, Actor 2, Actor 3"
          value={formData.stars}
          onChange={(e) => handleInputChange('stars', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="downloadLink">Download Link *</Label>
        <Input
          id="downloadLink"
          type="url"
          placeholder="https://example.com/download-link"
          value={formData.downloadLink}
          onChange={(e) => handleInputChange('downloadLink', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="poster">Movie Poster</Label>
        <Input
          id="poster"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {formData.poster && (
          <div className="mt-2">
            <img
              src={formData.poster}
              alt="Preview"
              className="w-32 h-40 object-cover rounded border"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Movie description..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
        </Button>
      </div>
    </form>
  );
};

export default MovieUploadForm;