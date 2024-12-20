import React from 'react';
import { useCreateArticle } from '../hooks/useArticles';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export const ArticleForm = () => {
  const [url, setUrl] = React.useState('');
  const [source, setSource] = React.useState('');
  const createArticle = useCreateArticle();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArticle.mutateAsync({ url, source });
      toast({
        title: 'Success',
        description: 'Article has been submitted for processing',
      });
      setUrl('');
      setSource('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Article URL"
          className="bg-zinc-800 border-zinc-700"
        />
      </div>
      <div>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dezeen">Dezeen</SelectItem>
            <SelectItem value="leibal">Leibal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        disabled={createArticle.isLoading}
        className="w-full"
      >
        {createArticle.isLoading ? 'Processing...' : 'Submit Article'}
      </Button>
    </form>
  );
};