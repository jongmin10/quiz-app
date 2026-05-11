import { getLocalQuiz } from '../data/questions';

/**
 * 카테고리를 받아 퀴즈 문제 배열을 반환합니다.
 * 로컬 문제 은행에서 하(4)·중(4)·상(2) 무작위 추출.
 *
 * @param {{ category: string }} options
 * @returns {Promise<Array>}
 */
export async function generateQuiz({ category }) {
  return getLocalQuiz(category);
}
