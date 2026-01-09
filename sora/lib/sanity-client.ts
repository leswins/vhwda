import { createClient, SanityClient as SanityClientType } from '@sanity/client';

export interface CareerDocument {
  _id: string;
  _type: 'career';
  title: {
    en: string;
    es?: string;
  };
  slug: {
    current: string;
  };
  videoUrl?: string;
}

/**
 * Sanity CMS client for updating career documents
 */
export class SanityClient {
  private client: SanityClientType;

  constructor(
    projectId: string,
    dataset: string,
    token: string
  ) {
    this.client = createClient({
      projectId,
      dataset,
      token,
      apiVersion: '2024-01-01',
      useCdn: false, // We need fresh data for mutations
    });
  }

  /**
   * Find a career document by its English title
   * @param careerTitle - The English title of the career (e.g., "Dentist")
   * @returns Career document or null if not found
   */
  async findCareerByTitle(careerTitle: string): Promise<CareerDocument | null> {
    try {
      const query = `*[_type == "career" && title.en == $careerTitle][0] {
        _id,
        _type,
        title,
        slug,
        videoUrl
      }`;

      const career = await this.client.fetch<CareerDocument | null>(query, {
        careerTitle,
      });

      return career;
    } catch (error) {
      throw new Error(`Error finding career "${careerTitle}": ${error}`);
    }
  }

  /**
   * Update the videoUrl field for a career document
   * @param careerId - The Sanity document _id
   * @param videoUrl - The public URL of the video
   */
  async updateVideoUrl(careerId: string, videoUrl: string): Promise<void> {
    try {
      console.log(`  Updating Sanity document ${careerId}...`);

      await this.client
        .patch(careerId)
        .set({ videoUrl })
        .commit();

      console.log(`  ✓ Sanity document updated`);
    } catch (error) {
      throw new Error(`Error updating career document: ${error}`);
    }
  }

  /**
   * Check if a career already has a video URL
   * @param careerTitle - The English title of the career
   * @returns true if video URL exists, false otherwise
   */
  async hasVideoUrl(careerTitle: string): Promise<boolean> {
    const career = await this.findCareerByTitle(careerTitle);
    return !!(career?.videoUrl);
  }

  /**
   * Get all careers with video URLs (for validation)
   */
  async getCareersWithVideos(): Promise<CareerDocument[]> {
    try {
      const query = `*[_type == "career" && defined(videoUrl)] {
        _id,
        title,
        slug,
        videoUrl
      }`;

      const careers = await this.client.fetch<CareerDocument[]>(query);
      return careers;
    } catch (error) {
      throw new Error(`Error fetching careers with videos: ${error}`);
    }
  }

  /**
   * Batch update multiple careers (for future use)
   */
  async batchUpdateVideos(updates: Array<{ careerId: string; videoUrl: string }>): Promise<void> {
    const transaction = this.client.transaction();

    updates.forEach(({ careerId, videoUrl }) => {
      transaction.patch(careerId, patch => patch.set({ videoUrl }));
    });

    await transaction.commit();
  }
}

