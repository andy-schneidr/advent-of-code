module Day21
  class << self
    def part_one(input)
      monkeys = parse(input)
      monkeys["root"].compute_simple(monkeys)
    end

    def part_two(input)
      monkeys = parse(input)
      monkeys["root"].solve(monkeys)
    end

    def parse(input)
      monkeys = {}
      input.each do |line|
        monke = Monke.new(line)
        monkeys[monke.name] = monke
      end
      monkeys
    end
  end

  class Monke
    attr_accessor :name
    attr_accessor :num
    attr_accessor :a
    attr_accessor :oper
    attr_accessor :b

    def initialize(line)
      @name = line.split(":")[0]
      num = line.scan(/\d+/)[0]
      if num != nil
        @num = num.to_i
      else
        bits = line.split(" ")
        @num = nil
        @a = bits[1]
        @oper = bits[2]
        @b = bits[3]
      end
    end

    def compute_simple(monkeys)
      if @num != nil
        return @num
      else
        # puts "@a: #{@a} @b: #{@b}"
        return (monkeys[@a].compute_simple(monkeys).send(@oper, monkeys[@b].compute_simple(monkeys)))
      end
    end

    # this is called by root
    def solve(monkeys)
      left = monkeys[@a].compute(monkeys)
      rght = monkeys[@b].compute(monkeys)
      # puts "#{left.to_s} == #{rght.to_s}"
      unroll(left, rght)
    end

    def unroll(left, rght)
      # Looking at my input i know "humn" is on the left for me, so "rght" will always contain a number
      while left.is_a? Array
        # puts "#{left.to_s} == #{rght.to_s}"
        oper = left[1]
        if left[0].is_a? Integer
          # number is on the left
          val = left[0]
          if oper == "/"
            # [val / [asdfasdf] = rght]
            rght = val / rght # also algebra wow
          elsif oper == "*"
            # [val * [asdfasdf] = rght]
            rght /= val
          elsif oper == "+"
            # [val + [asdfasdf] = rght]
            rght -= val
          elsif oper == "-"
            # [val - [asdfasdf] = rght]
            rght -= val
            rght *= -1 # have to do this because like, algebra i guess??
          end
          left = left[2]
        else
          # number is on the right
          val = left[2]
          if oper == "/"
            rght *= val
          elsif oper == "*"
            rght /= val
          elsif oper == "+"
            rght -= val
          elsif oper == "-"
            rght += val
          end
          left = left[0]
        end
      end
      return rght
    end

    def compute(monkeys)
      if @a == "humn"
        # Return an expression
        return ["humn", @oper, monkeys[@b].compute(monkeys)]
      else
        if @num != nil
          return @num
        else
          left = monkeys[@a].compute(monkeys)
          rght = monkeys[@b].compute(monkeys)
          # puts "@a: #{@a} @b: #{@b}"
          if (left.is_a? Integer) && (rght.is_a? Integer)
            return left.send(@oper, rght)
          end
          # Return a unit of an expression.
          # one of left, rght should be a number,
          # the other should be another expression of this form
          return [left, @oper, rght]
        end
      end
    end
  end
end

lines = File.readlines("examples/21/21.txt")
# puts Day21.part_one(lines)
# puts Day21.part_two(lines)
lines = File.readlines("inputs/21.txt")
# puts Day21.part_one(lines)
# puts Day21.part_two(lines)
# not 3949235418274
# 3099532691300 ?
