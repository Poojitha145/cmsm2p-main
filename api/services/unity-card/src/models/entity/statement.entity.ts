import { Entity, model, property } from '@loopback/repository';
import { StatementModel } from '../model/api.model';

export enum StatementEntityPaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

@model({
  settings: {
    mysql: {
      table: 'statement'
    }
  }
})
export class StatementEntity extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    mysql: {
      columnName: 'statement_id',
      dataLength: 50,
    }
  })
  statementId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'card_id',
      dataLength: 50,
    }
  })
  cardId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'user_local_id',
      dataLength: 50,
    }
  })
  userLocalId: string;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'amount',
    }
  })
  amount?: number;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'last_statement_balance',
    }
  })
  lastStatementBalance?: number;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'total_credit_amount',
    }
  })
  totalCreditAmount?: number;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'total_debit_amount',
    }
  })
  totalDebitAmount?: number;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'min_due_amount',
    }
  })
  minDueAmount?: number;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'cashback_earned',
      default: 0
    }
  })
  cashbackEarned?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'statement_month_year',
      dataLength: 20,
    }
  })
  statementMonthYear: string;


  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'statement_file_path',
      dataLength: 255,
    }
  })
  statementFilePath: string;

  @property({
    type: 'object',
    required: true,
    mysql: {
      columnName: 'finance_details'
    }
  })
  financeDetails: any;

  @property({
    type: 'string',
    required: false,
    mysql: {
      columnName: 'invoice_number',
      dataLength: 255,
    }
  })
  invoiceNumber?: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'payment_status'
    },
    jsonSchema: {
      enum: Object.values(StatementEntityPaymentStatus),
    }
  })
  paymentStatus: StatementEntityPaymentStatus;

  @property({
    type: 'object',
    required: false,
    mysql: {
      columnName: 'purchase_details'
    }
  })
  purchaseDetails?: any;

  @property({
    type: 'object',
    required: false,
    mysql: {
      columnName: 'emi_details'
    }
  })
  emiDetails?: any;

  @property({
    type: 'date',
    required: true,
    mysql: {
      columnName: 'due_on'
    }
  })
  dueOn: string;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'start_date',
      default: null
    }
  })
  startDate?: string;

  @property({
    type: 'date',
    required: true,
    mysql: {
      columnName: 'generated_at'
    }
  })
  generatedAt: string;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'created_at'
    }
  })
  createdAt?: string;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'updated_at'
    }
  })
  updatedAt?: string;

  constructor(data?: Partial<StatementEntity>) {
    super(data);
  }

  getStatementModel(): StatementModel {
    return <StatementModel>{
      id: this.statementId,
      amount: this.amount,
      lastStatementBalance: this.lastStatementBalance,
      // currentStatementAmount: number;
      totalCreditAmount: this.totalCreditAmount,
      totalDebitAmount: this.totalDebitAmount,
      minimumDueAmount: this.minDueAmount,
      // cash: number;
      purchase: this.purchaseDetails,
      finance: this.financeDetails,
      emi: this.emiDetails,
      paymentStatus: this.paymentStatus,
      startDate: this.startDate,
      statementDate: '',
      customerDueDate: this.dueOn,
      statementMonthYear: this.statementMonthYear
    };
  }
}

export interface StatementEntityRelations {
  // describe navigational properties here
}

export type UseStatementEntityWithRelations = StatementEntity & StatementEntityRelations;
