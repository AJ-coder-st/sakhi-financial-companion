/**
 * API Route: GET /api/lessons
 * 
 * Returns all available lessons from the lessons.json file.
 * No authentication required for reading lesson data.
 * 
 * Response:
 * {
 *   success: boolean,
 *   lessons: Lesson[],
 *   total: number,
 *   timestamp: string
 * }
 * 
 * Error Response:
 * {
 *   error: string,
 *   message: string
 * }
 * 
 * Usage in Express server/api-server.ts:
 * app.get('/api/lessons', async (req, res) => {
 *   try {
 *     const lessonsData = await import('../data/lessons.json', { assert: { type: 'json' } });
 *     
 *     res.json({
 *       success: true,
 *       lessons: lessonsData.default?.lessons || lessonsData.lessons || [],
 *       total: lessonsData.default?.lessons?.length || lessonsData.lessons?.length || 0,
 *       timestamp: new Date().toISOString()
 *     });
 *   } catch (error) {
 *     console.error('Error fetching lessons:', error);
 *     res.status(500).json({
 *       error: 'Failed to fetch lessons',
 *       message: 'An unexpected error occurred. Please try again later.'
 *     });
 *   }
 * });
 */
