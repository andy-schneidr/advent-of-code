module Day11
  class << self
    def part_one(input)
      monkeys = []
      0.step(input.length - 1, 7) { |i|
        monkeys.append(Monkey.new(input, i, 3))
      }

      0.step(19, 1) { |i|
        run_monkey_business(monkeys)
        puts "AFTER ROUND #{i+1} :"
        0.step(monkeys.length-1) { |n|
          puts "Monkey #{n}: #{monkeys[n].items.join(", ")} Inspections: #{monkeys[n].inspections}"
        }
      }

      monkeys.sort! { |a, b|  b.inspections <=> a.inspections }
      monkeys[0].inspections * monkeys[1].inspections

    end

    def part_two(input)
      monkeys = []
      0.step(input.length - 1, 7) { |i|
        monkeys.append(Monkey.new(input, i, 1))
      }
      stress_divider = 1
        0.step(monkeys.length-1) { |n|
          stress_divider *= monkeys[n].test
        }
        0.step(monkeys.length-1) { |n|
          monkeys[n].stress_divider = stress_divider
        }


      0.step(10000 - 1, 1) { |i|
        run_monkey_business(monkeys)
        puts "AFTER ROUND #{i+1} :"
        0.step(monkeys.length-1) { |n|
          puts "Monkey #{n}: #{monkeys[n].items.join(", ")} Inspections: #{monkeys[n].inspections}"
        }
      }

      monkeys.sort! { |a, b|  b.inspections <=> a.inspections }
      monkeys[0].inspections * monkeys[1].inspections
    end

    def run_monkey_business(monkeys)
      monkeys.each do |monkey|
        monkey.do_the_thing(monkeys)
      end
    end
  end

  class Monkey
    attr_accessor :operation
    attr_accessor :operation_value_self
    attr_accessor :operation_value
    attr_accessor :items
    attr_accessor :test
    attr_accessor :true_monkey
    attr_accessor :false_monkey
    attr_accessor :inspections
    attr_accessor :stress_divider

    def initialize(input, i, stress_divider)
      @items = input[i+1].scan(/\d+/).map!(&:to_i)
      @operation = input[i+2][23]
      if input[i+2].strip.end_with?("old")
        @operation_value_self = true
      else
        @operation_value = input[i+2].scan(/\d+/)[0].to_i
      end
      @test = input[i+3].scan(/\d+/)[0].to_i
      @true_monkey = input[i+4].scan(/\d+/)[0].to_i
      @false_monkey = input[i+5].scan(/\d+/)[0].to_i
      @inspections = 0
      @stress_divider = stress_divider
    end

    def do_the_thing(monkeys)
      # inspect all items
      while @items.length > 0
        @inspections += 1
        item = @items.shift
        # puts "item before: #{item}"
        case @operation
        when "+"
          if @operation_value_self
            item = item + item
          else
            item = item + @operation_value
          end
        when "*"
          if @operation_value_self
            item = item * item
          else
            item = item * @operation_value
          end
        end
        if @stress_divider == 3 # hacky, this sucks
          item = (item/@stress_divider).round
        else
          item = item % @stress_divider
        end
        # puts "item after: #{item}"
        if (item % @test) == 0
          # puts "TRUE #{@test} giving item to #{@true_monkey}"
          monkeys[@true_monkey].items.append(item)
        else
          # puts "FALSE #{@test} giving item to #{@false_monkey}"
          monkeys[@false_monkey].items.append(item)
        end
      end
    end
  end
end

lines = File.readlines("examples/11/111.txt")
puts Day11.part_one(lines)
# puts Day11.part_two(lines)
lines = File.readlines("inputs/11.txt")
# puts Day11.part_one(lines)
puts Day11.part_two(lines)
