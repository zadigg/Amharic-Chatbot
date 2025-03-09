export const getErrorMessage = (error: any): string => {
  // Log the full error for debugging
  console.error('Full error details:', {
    message: error.message,
    status: error.status,
    name: error.name,
    code: error.code,
    stack: error.stack,
  });

  // Handle specific error types
  if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
    return "ይቅርታ፣ ግንኙነቱ ተቋርጧል። እባክዎ እንደገና ይሞክሩ።";
  }

  if (error.status === 429 || error.message?.includes('rate') || error.message?.includes('quota')) {
    return "ይቅርታ፣ በአሁኑ ጊዜ ብዙ ጥያቄዎች አሉ። እባክዎ ጥቂት ቆይተው ይሞክሩ።";
  }

  if (error.status === 400 || error.message?.includes('invalid')) {
    return "ይቅርታ፣ ጥያቄው ትክክል አይደለም። እባክዎ በተለየ መልኩ ይሞክሩ።";
  }

  if (error.status === 401 || error.status === 403 || error.message?.includes('auth') || error.message?.includes('key')) {
    return "ይቅርታ፣ የተጠቃሚ ፈቃድ ችግር አለ። እባክዎ እንደገና ይሞክሩ።";
  }

  if (error.status === 404 || error.message?.includes('not found')) {
    return "ይቅርታ፣ የተጠየቀው ሞዴል አልተገኘም።";
  }

  if (error.message?.includes('network') || error.message?.includes('connection')) {
    return "ይቅርታ፣ የኢንተርኔት ግንኙነት ችግር አለ። እባክዎ ግንኙነትዎን ያረጋግጡ እና እንደገና ይሞክሩ።";
  }

  // Default error message
  return "ይቅርታ፣ ችግር ተፈጥሯል። እባክዎ ቆይተው እንደገና ይሞክሩ።";
};