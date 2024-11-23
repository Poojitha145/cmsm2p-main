
export namespace M2PUtil {

    export function getPreviousStatementMonthYear(statementMonthYear: string): string {
        const month: number = Number.parseInt(statementMonthYear.substring(0, 2)) - 1;
        const year: number = Number.parseInt(statementMonthYear.substring(2));
        const previousMonth: number = (month - 1 + 12) % 12;
        const previousYear: number = previousMonth == 11 ? year - 1 : year;

        return (previousMonth + 1).toString().padStart(2, '0')
            + previousYear.toString().padStart(2, '0');
    }

}