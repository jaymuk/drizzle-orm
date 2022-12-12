import { ColumnConfig } from 'drizzle-orm';
import { ColumnBuilderConfig } from 'drizzle-orm/column-builder';
import { AnyMySqlTable } from '~/table';
import { MySqlColumn, MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common';

export class MySqlDoubleBuilder extends MySqlColumnBuilderWithAutoIncrement<
	ColumnBuilderConfig<{
		data: number;
		driverParam: number | string;
	}>
> {
	/** @internal */ precision: number | undefined;
	/** @internal */ scale: number | undefined;

	constructor(name: string, precision?: number, scale?: number) {
		super(name);
		this.precision = precision;
		this.scale = scale;
	}

	/** @internal */
	override build<TTableName extends string>(
		table: AnyMySqlTable<{ name: TTableName }>,
	): MySqlDouble<TTableName> {
		return new MySqlDouble(table, this);
	}
}

export class MySqlDouble<
	TTableName extends string,
> extends MySqlColumnWithAutoIncrement<
	ColumnConfig<{
		tableName: TTableName;
		data: number;
		driverParam: number | string;
	}>
> {
	protected override $mySqlColumnBrand!: 'MySqlDouble';

	precision: number | undefined;
	scale: number | undefined;

	constructor(table: AnyMySqlTable<{name: TTableName}>, builder: MySqlDoubleBuilder) {
		super(table, builder);
		this.precision = builder.precision;
		this.scale = builder.scale;
	}

	getSQLType(): string {
		return 'double';
		// if (typeof this.precision !== 'undefined' && typeof this.scale !== 'undefined') {
		// 	return `double(${this.precision}, ${this.scale})`;
		// } else if (typeof this.precision === 'undefined') {
		// 	return 'double';
		// } else {
		// 	return `double(${this.precision})`;
		// }
	}
}

export interface MySqlDoubleConfig {
	precision?: number;
	scale?: number;
}

export function double(name: string, config?: MySqlDoubleConfig): MySqlDoubleBuilder {
	return new MySqlDoubleBuilder(name, config?.precision, config?.scale);
}
