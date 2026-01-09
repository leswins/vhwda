import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export interface ProcessedCareer {
  career: string;
  slug: string;
  videoUrl: string;
  timestamp: string;
  videoId?: string;
}

export interface FailedCareer {
  career: string;
  slug: string;
  error: string;
  timestamp: string;
  attempts: number;
}

export interface ProgressState {
  startedAt: string;
  lastUpdatedAt: string;
  totalCareers: number;
  completed: ProcessedCareer[];
  failed: FailedCareer[];
  currentBatch: number;
}

/**
 * Progress tracker for resumable video generation
 */
export class ProgressTracker {
  private progressFile: string;
  private state: ProgressState;

  constructor(progressFilePath?: string) {
    this.progressFile = progressFilePath || path.join(process.cwd(), 'progress.json');
    this.state = this.loadState();
  }

  /**
   * Load progress state from file, or create new state
   */
  private loadState(): ProgressState {
    if (existsSync(this.progressFile)) {
      try {
        const content = readFileSync(this.progressFile, 'utf-8');
        const state = JSON.parse(content) as ProgressState;
        console.log(`✓ Loaded progress: ${state.completed.length} completed, ${state.failed.length} failed`);
        return state;
      } catch (error) {
        console.warn('⚠ Failed to parse progress file, starting fresh');
      }
    }

    // Return new state
    return {
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      totalCareers: 0,
      completed: [],
      failed: [],
      currentBatch: 0,
    };
  }

  /**
   * Save current state to file
   */
  private saveState(): void {
    try {
      this.state.lastUpdatedAt = new Date().toISOString();
      writeFileSync(this.progressFile, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (error) {
      console.error('❌ Failed to save progress:', error);
    }
  }

  /**
   * Initialize tracking for a new run
   */
  initialize(totalCareers: number): void {
    if (this.state.completed.length === 0 && this.state.failed.length === 0) {
      this.state.startedAt = new Date().toISOString();
      this.state.totalCareers = totalCareers;
      this.saveState();
    }
  }

  /**
   * Mark a career as successfully completed
   */
  markCompleted(career: string, slug: string, videoUrl: string, videoId?: string): void {
    this.state.completed.push({
      career,
      slug,
      videoUrl,
      videoId,
      timestamp: new Date().toISOString(),
    });
    this.saveState();
    console.log(`✓ Progress: ${this.state.completed.length}/${this.state.totalCareers} completed`);
  }

  /**
   * Mark a career as failed
   */
  markFailed(career: string, slug: string, error: string, attempts: number = 3): void {
    this.state.failed.push({
      career,
      slug,
      error,
      attempts,
      timestamp: new Date().toISOString(),
    });
    this.saveState();
    console.error(`✗ Failed: ${career} - ${error}`);
  }

  /**
   * Update current batch number
   */
  setBatch(batchNumber: number): void {
    this.state.currentBatch = batchNumber;
    this.saveState();
  }

  /**
   * Check if a career has already been processed
   */
  isCompleted(careerName: string): boolean {
    return this.state.completed.some(c => c.career === careerName);
  }

  /**
   * Check if a career has failed
   */
  hasFailed(careerName: string): boolean {
    return this.state.failed.some(c => c.career === careerName);
  }

  /**
   * Get list of completed career names
   */
  getCompletedNames(): string[] {
    return this.state.completed.map(c => c.career);
  }

  /**
   * Get list of failed career names
   */
  getFailedNames(): string[] {
    return this.state.failed.map(c => c.career);
  }

  /**
   * Get current progress state
   */
  getState(): ProgressState {
    return { ...this.state };
  }

  /**
   * Generate a summary report
   */
  getSummary(): string {
    const completed = this.state.completed.length;
    const failed = this.state.failed.length;
    const total = this.state.totalCareers;
    const remaining = total - completed - failed;
    const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PROGRESS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Started:    ${new Date(this.state.startedAt).toLocaleString()}
Updated:    ${new Date(this.state.lastUpdatedAt).toLocaleString()}

Total:      ${total} careers
Completed:  ${completed} (${successRate}%)
Failed:     ${failed}
Remaining:  ${remaining}

${failed > 0 ? `\nFailed careers:\n${this.state.failed.map(f => `  - ${f.career}: ${f.error}`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  /**
   * Reset progress (for fresh start)
   */
  reset(): void {
    this.state = {
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      totalCareers: 0,
      completed: [],
      failed: [],
      currentBatch: 0,
    };
    this.saveState();
    console.log('✓ Progress reset');
  }
}

