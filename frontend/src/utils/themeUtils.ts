/**
 * 헥스(Hex) 색상 코드 무결성 검증
 * @param color 검증할 문자열
 * @returns 유효한 hex 코드인지 여부 (boolean)
 */
export const isValidHexColor = (color: string | null | undefined): boolean => {
    if (!color) return false;
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexRegex.test(color);
};
