import { getUserMostRecentActivity } from "~/services/zebra"
import type { KeywordsInput } from "~/types"




const userActivity = await getUserMostRecentActivity();


export function detectZebraActivities(keywords: KeywordsInput[]) {

  const keywordTotal = keywords.reduce((acc, keyword) => acc + keyword.count, 0);
  let mostKeywords = keywords.filter(keyword => keyword.count > keywordTotal / keywords.length);


  if (mostKeywords.length < 5) {
    mostKeywords = keywords.slice(0, 5);
  }

  const activityTotal = userActivity.reduce((acc, activity) => acc + activity.count, 0);
  let mostActivityKeywords = userActivity.filter(activity => activity.count > activityTotal / userActivity.length);


  const activitySuggestion = [] as any[];

  mostActivityKeywords.forEach((activityKeyword) => {

    if (Array.isArray(activityKeyword.keywords)) {

      activityKeyword.keywords.forEach(word => {

        const currentWord = mostKeywords.find((keyword) => keyword.words === word.words);
        if (currentWord) {
          const activityAlreadySuggested = activitySuggestion.find((activity) => activity.name === activityKeyword.name);
          if (activityAlreadySuggested) {
            activityAlreadySuggested.probability += activityKeyword.probability + currentWord.percent;
            activityAlreadySuggested.keywords.push(word);
          } else {
            activitySuggestion.push({
              name: activityKeyword.name,
              alias: activityKeyword.alias,
              probability: activityKeyword.probability + currentWord.percent,
              keywords: [word]
            });
          }
        }



      });


    }
  });
  activitySuggestion.sort((a, b) => (a.probability < b.probability) ? 1 : -1);
  return activitySuggestion;
}





