const TEST_ID_PATTERN = /^QA-[A-Z]+-\d{3}[A-Z]?$/;

/**
 * Adds searchable, reporter-visible QA metadata to a Playwright test.
 *
 * IDs are also tags so a test can be selected with `--grep @QA-AREA-001`.
 */
export function testMetadata(id: string, description: string) {
  if (!TEST_ID_PATTERN.test(id)) {
    throw new Error(`Invalid test ID "${id}". Expected QA-AREA-001 format.`);
  }

  if (!description.trim()) {
    throw new Error(`Test ${id} must have a non-empty description.`);
  }

  return {
    tag: `@${id}`,
    annotation: [
      { type: 'test_id', description: id },
      { type: 'description', description },
    ],
  };
}
