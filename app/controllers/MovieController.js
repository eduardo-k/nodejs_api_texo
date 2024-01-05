const fs = require('fs');
const Movie = require('../models/Movie');
const MovieService = require('../services/MovieService');
const NotFoundError = require('../errors/NotFoundError');

class MovieController {
  async getAll(req, res) {
    try {
      const service = MovieService;
      const movies = await service.getAll();

      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const movieId = req.params.movieId;
      const service = MovieService;
      const movie = await service.getById(movieId);

      if (movie === null) {
        return res.status(404).json({ error: `Movie id ${movieId} not found`});
      }

      return res.status(200).json(movie);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async post(req, res) {
    try {
      const movie = req.body;

      const validation = await Movie.schema.validate(movie);
      if (validation.error) {
        return res.status(400).json({ error: `Invalid request: ${validation.error}` });
      }

      const service = MovieService;
      const result = await service.post(movie);

      return res.status(200).json({ message: 'Movie created successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async postFile(req, res) {
    try {
      if (req.body.file === undefined) {
        return res.status(400).json({ error: "Field 'file' must be informed"});
      }

      const file = req.body.file;

      if (!fs.existsSync(file)) {
        return res.status(404).json({"error": `File '${file}' not found`});
      }

      const service = MovieService;
      service.postFile(fs, file);

      return res.status(200).json({ message: 'Movies created successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getWinners(req, res) {
    const service = MovieService;
    const producers = await service.getWinners();

    return res.status(200).json(producers);
  }

  async getAnswer(req, res) {
    try {
      const service = MovieService;
      const answer = await service.getAnswer();
  
      return res.status(200).json(answer);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delAll(req, res) {
    try {
      const service = MovieService;

      await service.delAll();
      return res.status(200).json({ message: 'Movies deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delById(req, res) {
    try {
      const movieId = req.params.movieId;
      const service = MovieService;
      await service.delById(movieId);
  
      return res.status(200).json({ message: `Movie id ${movieId} deleted successfully` });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new MovieController();