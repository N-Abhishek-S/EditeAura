/**
 * EmbeddingProvider Interface
 */
export class EmbeddingProvider {
  constructor(apiKey) {
    if (new.target === EmbeddingProvider) throw new Error('EmbeddingProvider is abstract.');
    this.apiKey = apiKey;
  }
  /** @param {string[]} texts @returns {Promise<number[][]>} */
  async embed(texts) { throw new Error('Not implemented'); }
  get name() { return 'EmbeddingProvider'; }
  isAvailable() { return !!this.apiKey; }
}

/**
 * VectorStore Interface
 */
export class VectorStore {
  /**
   * @param {string} id
   * @param {number[]} vector
   * @param {object} metadata
   */
  async upsert(id, vector, metadata) { throw new Error('Not implemented'); }

  /**
   * @param {number[]} queryVector
   * @param {number} topK
   * @returns {Promise<Array<{id, score, metadata}>>}
   */
  async query(queryVector, topK = 3) { throw new Error('Not implemented'); }

  /** @param {string} id */
  async delete(id) { throw new Error('Not implemented'); }

  get name() { return 'VectorStore'; }
}

/**
 * NotificationProvider Interface
 */
export class NotificationProvider {
  /**
   * @param {object} payload
   * @returns {Promise<{success: boolean}>}
   */
  async send(payload) { throw new Error('Not implemented'); }
  get name() { return 'NotificationProvider'; }
  isAvailable() { return false; }
}
